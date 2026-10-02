"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import { bodyTypes, clampBox, commitFinding, normalizePlate, originals, parseSaved, storageKey, type BoundingBox, type Finding, type VehicleResult } from "@/lib/analysis-prototype/model";
import { buildArchive, createDemoSource, downloadBytes } from "@/lib/analysis-prototype/export";
import styles from "./AnalysisEditor.module.css";

type Drafts = Record<string, VehicleResult>;
type Gesture = { start: [number, number]; box: BoundingBox; key: string; mode: "move" | "draw" | "resize"; corner?: string };
const keyOf = (id: string, finding: Finding) => `${id}/${finding}`;
const boxStyle = (box: BoundingBox): CSSProperties => ({ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.width * 100}%`, height: `${box.height * 100}%` });
function Crop({ source, box, label }: { source: string; box: BoundingBox; label: string }) {
  return <div className={styles.crop} role="img" aria-label={label} style={{ aspectRatio: (box.width * 2244) / (box.height * 1402) }}><img src={source} alt="" style={{ width: `${100 / box.width}%`, left: `${-box.x / box.width * 100}%`, top: `${-box.y / box.height * 100}%` }} /></div>;
}

export function AnalysisEditor() {
  const [source, setSource] = useState("");
  const [saved, setSaved] = useState<VehicleResult[]>(originals);
  const [drafts, setDrafts] = useState<Drafts>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [finding, setFinding] = useState<Finding>("vehicle");
  const [boxes, setBoxes] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Araç seçerek bulgularını inceleyebilirsin.");
  const [error, setError] = useState("");
  const [downloadScope, setDownloadScope] = useState<"all" | "selected" | null>(null);
  const [busy, setBusy] = useState(false);
  const [gesture, setGesture] = useState<Gesture | null>(null);

  useEffect(() => {
    let active = true;
    createDemoSource().then((src) => {
      if (!active) return;
      setSource(src);
      try { const record = localStorage.getItem(storageKey); if (record) setSaved(parseSaved(record)); }
      catch { setError("Kaydedilmiş örnek sonuçlar okunamadı. Başlangıç verileri açıldı; yeni değişiklikleri kaydedebilirsin."); }
      setReady(true);
    }).catch(() => { if (active) setError("Örnek görsel yüklenemedi. Sayfayı yenileyerek tekrar dene."); });
    return () => { active = false; };
  }, []);

  const displayed = (vehicle: VehicleResult): VehicleResult => {
    const vehicleDraft = drafts[keyOf(vehicle.id, "vehicle")];
    const plateDraft = drafts[keyOf(vehicle.id, "plate")];
    return { ...vehicle, ...(vehicleDraft ? { vehicleBox: vehicleDraft.vehicleBox, bodyType: vehicleDraft.bodyType } : {}), ...(plateDraft ? { plateBox: plateDraft.plateBox, plateText: plateDraft.plateText } : {}), ...(vehicleDraft && !vehicleDraft.vehicleBox ? { plateBox: null } : {}) };
  };
  const currentSaved = saved.find((vehicle) => vehicle.id === selected);
  const current = currentSaved ? displayed(currentSaved) : null;
  const key = selected ? keyOf(selected, finding) : "";
  const editing = Boolean(drafts[key]);
  const currentBox = current ? finding === "vehicle" ? current.vehicleBox : current.plateBox : null;
  const visible = saved.map(displayed).filter((vehicle) => vehicle.vehicleBox);

  const choose = (id: string, next: Finding = "vehicle") => { setSelected(id); setFinding(next); setDrawing(false); setZoom(1); setError(""); };
  const beginEdit = () => { if (current) { setDrafts((previous) => ({ ...previous, [key]: { ...current } })); setBoxes(true); } };
  const updateDraft = (patch: Partial<VehicleResult>) => { if (current) setDrafts((previous) => ({ ...previous, [key]: { ...(previous[key] ?? current), ...patch } })); };
  const updateBox = (box: BoundingBox, targetKey = key) => {
    setDrafts((previous) => { const draft = previous[targetKey]; if (!draft) return previous; return { ...previous, [targetKey]: { ...draft, [targetKey.endsWith("/plate") ? "plateBox" : "vehicleBox"]: clampBox(box) } }; });
  };
  const persist = (next: VehicleResult[]) => {
    localStorage.setItem(storageKey, JSON.stringify(next)); setSaved(next); setError("");
  };
  const validate = (vehicle: VehicleResult, target: Finding) => {
    if (target === "plate" && vehicle.plateBox && !normalizePlate(vehicle.plateText)) throw new Error("Plaka kutusu için plaka metni gir veya yanlış tespiti kaldır.");
  };
  const save = () => {
    if (!currentSaved || !drafts[key]) return;
    try { validate(drafts[key], finding); persist(saved.map((vehicle) => vehicle.id === selected ? commitFinding(vehicle, drafts[key], finding) : vehicle)); setDrafts((previous) => { const next = { ...previous }; delete next[key]; if (finding === "vehicle" && !drafts[key].vehicleBox) delete next[keyOf(selected!, "plate")]; return next; }); setDrawing(false); setMessage("Bulgu kaydedildi. Sayfa yenilendiğinde korunacak."); }
    catch (reason) { setError(reason instanceof Error && reason.message.startsWith("Plaka") ? reason.message : "Kayıt yapılamadı. Tarayıcı depolaması kapalı veya dolu olabilir. Taslağın korunuyor."); }
  };
  const cancel = () => {
    const discardNew = finding === "vehicle" && currentSaved && !currentSaved.vehicleBox && !currentSaved.edited.vehicle && !originals.some((vehicle) => vehicle.id === selected);
    setDrafts((previous) => { const next = { ...previous }; delete next[key]; if (discardNew) delete next[keyOf(selected!, "plate")]; return next; });
    if (discardNew) { setSaved((previous) => previous.filter((vehicle) => vehicle.id !== selected)); setSelected(null); }
    setDrawing(false); setError(""); setMessage("Seçili bulgunun değişiklikleri iptal edildi.");
  };
  const restore = () => {
    if (!currentSaved) return;
    const original = originals.find((vehicle) => vehicle.id === selected);
    try {
      if (!original && finding === "vehicle") {
        persist(saved.filter((vehicle) => vehicle.id !== selected));
        setDrafts((previous) => { const next = { ...previous }; delete next[key]; delete next[keyOf(selected!, "plate")]; return next; });
        setSelected(null); setDrawing(false); setMessage("Kullanıcının eklediği araç kaldırıldı; başlangıçta bu bulgu yoktu."); return;
      }
      const restored = original ? { ...commitFinding(currentSaved, original, finding), edited: { ...currentSaved.edited, [finding]: false } } : { ...currentSaved, ...(finding === "vehicle" ? { vehicleBox: null, plateBox: null, plateText: "" } : { plateBox: null, plateText: "" }), edited: { ...currentSaved.edited, [finding]: false } };
      persist(saved.map((vehicle) => vehicle.id === selected ? restored : vehicle));
      setDrafts((previous) => { const next = { ...previous }; delete next[key]; if (!restored.vehicleBox) delete next[keyOf(selected!, "plate")]; return next; }); setDrawing(false); setMessage("Seçili bulgu orijinal model sonucuna döndü.");
    } catch { setError("Orijinal sonuç kaydedilemedi. Tarayıcı depolama izinlerini kontrol et."); }
  };
  const addVehicle = () => {
    const id = `vehicle-${crypto.randomUUID()}`;
    const vehicle: VehicleResult = { id, bodyType: "Bilinmiyor", plateText: "", vehicleBox: null, plateBox: null, edited: { vehicle: false, plate: false } };
    setSaved((previous) => [...previous, vehicle]); setDrafts((previous) => ({ ...previous, [keyOf(id, "vehicle")]: vehicle })); setSelected(id); setFinding("vehicle"); setDrawing(true); setBoxes(true); setZoom(1); setExpanded(false); setMessage("Görsel üzerinde sürükleyerek araç kutusu çiz.");
  };
  const startDraw = () => { beginEdit(); setDrawing(true); setZoom(1); setExpanded(false); setMessage("Görsel üzerinde sürükleyerek kutu çiz."); };
  const point = (event: PointerEvent): [number, number] => { const rect = event.currentTarget.closest("[data-editor-plane]")!.getBoundingClientRect(); return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))]; };
  const startGesture = (event: PointerEvent, mode: Gesture["mode"], box: BoundingBox, corner?: string) => {
    if (event.button !== 0 || !editing) return;
    const target = event.currentTarget.closest<HTMLDivElement>("[data-editor-plane]"); if (!target) return;
    event.preventDefault(); event.stopPropagation(); target.setPointerCapture(event.pointerId); setGesture({ start: point(event), mode, box, corner, key });
  };
  const move = (event: PointerEvent) => {
    const drag = gesture; if (!drag) return;
    const [x, y] = point(event), [sx, sy] = drag.start;
    let box: BoundingBox;
    if (drag.mode === "draw") box = { x: Math.min(sx, x), y: Math.min(sy, y), width: Math.abs(x - sx), height: Math.abs(y - sy) };
    else if (drag.mode === "move") box = { ...drag.box, x: drag.box.x + x - sx, y: drag.box.y + y - sy };
    else {
      const west = drag.corner!.includes("w"), north = drag.corner!.includes("n");
      const left = west ? Math.min(x, drag.box.x + drag.box.width - .008) : drag.box.x;
      const top = north ? Math.min(y, drag.box.y + drag.box.height - .008) : drag.box.y;
      const right = west ? drag.box.x + drag.box.width : Math.max(x, drag.box.x + .008);
      const bottom = north ? drag.box.y + drag.box.height : Math.max(y, drag.box.y + .008);
      box = { x: left, y: top, width: right - left, height: bottom - top };
    }
    updateBox(box, drag.key);
  };
  const finish = () => { if (gesture?.mode === "draw") setDrawing(false); setGesture(null); };

  const download = async (scope: "all" | "selected", includeDrafts = false) => {
    setBusy(true); setError("");
    try {
      let values = saved;
      if (includeDrafts) {
        values = saved.map((vehicle) => {
          let result = vehicle;
          for (const target of ["vehicle", "plate"] as Finding[]) { const draft = drafts[keyOf(vehicle.id, target)]; if (draft && (target === "vehicle" || result.vehicleBox)) { validate(draft, target); result = commitFinding(result, draft, target); } }
          return result;
        });
        persist(values); setDrafts({}); setDrawing(false);
      }
      values = values.filter((vehicle) => vehicle.vehicleBox && (scope === "all" || vehicle.id === selected));
      if (!values.length) throw new Error("İndirilecek kaydedilmiş araç bulunamadı. Önce bir araç kutusu kaydet.");
      const bytes = await buildArchive(source, values); downloadBytes(bytes, scope === "all" ? "vehicle-vision-all.zip" : "vehicle-vision-selected.zip"); setDownloadScope(null); setMessage("ZIP hazır: JSON, kutulu görsel ve araç/plaka kırpımları.");
    } catch (reason) { setError(reason instanceof Error ? `İndirme tamamlanamadı: ${reason.message}` : "İndirme tamamlanamadı. Tekrar dene."); }
    finally { setBusy(false); }
  };
  const requestDownload = (scope: "all" | "selected") => { if (Object.keys(drafts).length) setDownloadScope(scope); else void download(scope); };

  return <section className={styles.editor} aria-label="Düzenlenebilir Focus Canvas">
    <div className={styles.titleRow}><h1>LOOK CLOSER.</h1><div><span>İki araçlı demo kompozisyonu · örnek sonuçlar</span><button disabled={!ready || busy} onClick={() => requestDownload("all")}>{busy ? "Hazırlanıyor…" : "Tüm sonuçları indir"}</button></div></div>
    <div className={styles.workspace}>
      <div className={styles.visualColumn}>
        <div className={styles.canvas}>
          {!source ? <p>Örnek görsel hazırlanıyor…</p> : <div className={styles.imageViewport}>
            <div data-editor-plane className={`${styles.imagePlane} ${editing ? styles.editing : ""}`} data-drawing={drawing} style={{ "--zoom": zoom, transformOrigin: currentBox ? `${(currentBox.x + currentBox.width / 2) * 100}% ${(currentBox.y + currentBox.height / 2) * 100}%` : "50% 50%" } as CSSProperties}
              onPointerDown={(event) => { if (drawing) { const [x, y] = point(event); startGesture(event, "draw", { x, y, width: .008, height: .008 }); updateBox({ x, y, width: .008, height: .008 }); } }} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}>
              <img src={source} alt="Çoklu araç akışını denemek için aynı sedan fotoğrafından hazırlanmış iki araçlı demo" draggable={false} />
              {boxes && saved.map(displayed).flatMap((vehicle, index) => (["vehicle", "plate"] as Finding[]).map((target) => {
                const box = target === "vehicle" ? vehicle.vehicleBox : vehicle.plateBox;
                if (!box || (!vehicle.vehicleBox && target === "plate")) return null;
                const active = selected === vehicle.id && finding === target;
                return <div key={keyOf(vehicle.id, target)} className={`${styles.box} ${active ? styles.activeBox : ""} ${target === "plate" ? styles.plateBox : ""}`} style={boxStyle(box)}>
                  <button className={styles.boxHit} aria-label={`${index + 1}. ${target === "vehicle" ? "aracı" : "plakayı"} seç`} onClick={() => { if (!drawing) choose(vehicle.id, target); }} onPointerDown={(event) => { if (active && editing && !drawing) startGesture(event, "move", box); }}><span>{target === "vehicle" ? `ARAÇ ${index + 1}` : "PLAKA"}</span></button>
                  {active && editing && !drawing && ["nw", "ne", "sw", "se"].map((corner) => <button key={corner} className={`${styles.handle} ${styles[corner]}`} aria-label={`${corner} kutu köşesini boyutlandır`} onPointerDown={(event) => startGesture(event, "resize", box, corner)} />)}
                </div>;
              }))}
            </div>
          </div>}
          <div className={styles.toolbar}><button aria-label="Uzaklaştır" disabled={zoom <= 1 || drawing} onClick={() => setZoom(Math.max(1, zoom - .25))}>−</button><output>{Math.round(zoom * 100)}%</output><button aria-label="Yakınlaştır" disabled={zoom >= 2 || drawing} onClick={() => setZoom(Math.min(2, zoom + .25))}>+</button><button onClick={() => setZoom(1)}>Sığdır</button><button aria-pressed={boxes} onClick={() => setBoxes(!boxes)} disabled={editing}>Kutular</button></div>
        </div>
        <div className={styles.thumbnailRow}>{source && visible.map((vehicle, index) => <button key={vehicle.id} aria-pressed={selected === vehicle.id} onClick={() => choose(vehicle.id)}><Crop source={source} box={vehicle.vehicleBox!} label={`Araç ${index + 1} kırpımı`} /><span>Araç {index + 1}{Object.keys(drafts).some((item) => item.startsWith(`${vehicle.id}/`)) ? " · Taslak" : ""}</span></button>)}<button className={styles.addVehicle} onClick={addVehicle} disabled={!ready}>Araç ekle</button></div>
        <p className={styles.status} role="status">{message}</p>
      </div>
      <aside className={`${styles.panel} ${expanded ? styles.expanded : ""}`}>
        <button className={styles.sheetHandle} onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? "Paneli küçült" : "Paneli büyüt"}<span /></button>
        <div className={styles.panelBody}>
          {!selected ? <><h2>HER BULGU,<br />YERİNDE.</h2><p className={styles.intro}>{visible.length} araç bulundu. Ayrıntıları ve düzenleme seçeneklerini açmak için bir araç seç.</p><div className={styles.summary}>{saved.map((vehicle, index) => <button key={vehicle.id} onClick={() => choose(vehicle.id)}><span>Araç {index + 1}{!vehicle.vehicleBox ? " · Kaldırıldı / eksik" : ""}</span><strong>{vehicle.bodyType}</strong><span>{vehicle.plateBox ? vehicle.plateText : "Plaka bulunamadı"}</span>{(vehicle.edited.vehicle || vehicle.edited.plate) && <small>Kullanıcı tarafından düzenlendi</small>}</button>)}</div></> : current && <>
            <button className={styles.back} onClick={() => { setSelected(null); setDrawing(false); }}>Tüm sonuçlar</button>
            <div className={styles.tabs}>{(["vehicle", "plate"] as Finding[]).map((target) => <button key={target} aria-pressed={finding === target} onClick={() => { setFinding(target); setDrawing(false); }}>{target === "vehicle" ? "Araç" : "Plaka"}{drafts[keyOf(current.id, target)] && <i aria-label="Kaydedilmemiş taslak" />}</button>)}</div>
            <span className={styles.resultLabel}>{finding === "vehicle" ? "KASA TİPİ" : "PLAKA METNİ"}</span>
            {editing ? <label className={styles.field}>{finding === "vehicle" ? "Kasa tipi" : "Plaka metni"}{finding === "vehicle" ? <select value={current.bodyType} onChange={(event) => updateDraft({ bodyType: event.target.value })}>{bodyTypes.map((type) => <option key={type}>{type}</option>)}</select> : <input value={current.plateText} maxLength={64} onChange={(event) => updateDraft({ plateText: event.target.value })} onBlur={() => updateDraft({ plateText: normalizePlate(current.plateText) })} />}</label> : <strong className={styles.resultValue}>{finding === "vehicle" ? current.bodyType : current.plateText || "BULUNAMADI"}</strong>}
            {currentSaved?.edited[finding] && <p className={styles.editedMark}>Kullanıcı tarafından düzenlendi</p>}
            {currentBox && source ? <Crop source={source} box={currentBox} label="Seçili bulgunun güncel kırpımı" /> : <p className={styles.empty}>Bu bulgunun kutusu yok. Düzenleyerek yeni bir kutu çizebilirsin.</p>}
            {editing ? <>
              <p className={styles.helper}>{drawing ? "Görsel üzerinde sürükleyerek kutu çiz." : "Kutuyu taşı veya köşelerinden boyutlandır. Crop anında güncellenir."}</p>
              {currentBox && <fieldset className={styles.coordinates}><legend>Kutu konumu (%)</legend>{(["x", "y", "width", "height"] as const).map((coordinate) => <label key={coordinate}>{({ x: "X", y: "Y", width: "Genişlik", height: "Yükseklik" })[coordinate]}<input type="number" min={coordinate === "x" || coordinate === "y" ? 0 : .8} max={100} step={.1} value={Math.round(currentBox[coordinate] * 1000) / 10} onChange={(event) => { const value = event.target.valueAsNumber; if (Number.isFinite(value)) updateBox({ ...currentBox, [coordinate]: value / 100 }); }} /></label>)}</fieldset>}
              <div className={styles.secondaryActions}><button onClick={startDraw} disabled={finding === "plate" && !current.vehicleBox}>{currentBox ? "Kutuyu yeniden çiz" : "Kutu çiz"}</button>{currentBox && <button onClick={() => { updateDraft(finding === "vehicle" ? { vehicleBox: null, plateBox: null } : { plateBox: null, plateText: "" }); setDrawing(false); }}>Tespiti kaldır</button>}</div>
              <div className={styles.saveActions}><button onClick={save} disabled={drawing}>Kaydet</button><button onClick={cancel}>Vazgeç</button></div>
              <p className={styles.draftNote}>Kaydedilmemiş taslak · başka bulguya geçsen de korunur.</p>
            </> : <button className={styles.primary} onClick={beginEdit} disabled={finding === "plate" && !current.vehicleBox}>Düzenle</button>}
            <div className={styles.bottomActions}><button onClick={restore} disabled={finding === "plate" && !current.vehicleBox}>Orijinal sonuca dön</button><button onClick={() => requestDownload("selected")} disabled={busy || !current.vehicleBox}>Seçili aracı indir</button></div>
          </>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          {downloadScope && <div className={styles.downloadChoice} role="group" aria-label="İndirme öncesi taslak seçenekleri"><p>Kaydedilmemiş değişiklikler var.</p><button onClick={() => void download(downloadScope, true)} disabled={busy}>Kaydet ve indir</button><button onClick={() => void download(downloadScope)} disabled={busy}>Son kaydedilen hali indir</button><button onClick={() => setDownloadScope(null)} disabled={busy}>İptal</button></div>}
          <p className={styles.prototypeNote}>Örnek analiz · kayıt yalnız bu tarayıcıda.<br />Kasa sınıfları prototip içindir.</p>
        </div>
      </aside>
    </div>
  </section>;
}
