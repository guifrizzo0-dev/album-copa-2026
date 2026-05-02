import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Filter, BarChart3, ArrowLeftRight, Camera, X, Loader2, Check, LogOut, Users } from 'lucide-react';
import { supabase } from './supabaseClient';

const STICKERS_PER_TEAM = 20;

const GROUPS = {
  A: [
    { code: 'MEX', name: 'México', flag: '🇲🇽' },
    { code: 'RSA', name: 'África do Sul', flag: '🇿🇦' },
    { code: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷' },
    { code: 'CZE', name: 'República Tcheca', flag: '🇨🇿' },
  ],
  B: [
    { code: 'CAN', name: 'Canadá', flag: '🇨🇦' },
    { code: 'BIH', name: 'Bósnia e Herzegovina', flag: '🇧🇦' },
    { code: 'QAT', name: 'Catar', flag: '🇶🇦' },
    { code: 'SUI', name: 'Suíça', flag: '🇨🇭' },
  ],
  C: [
    { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
    { code: 'MAR', name: 'Marrocos', flag: '🇲🇦' },
    { code: 'HAI', name: 'Haiti', flag: '🇭🇹' },
    { code: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  ],
  D: [
    { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'PAR', name: 'Paraguai', flag: '🇵🇾' },
    { code: 'AUS', name: 'Austrália', flag: '🇦🇺' },
    { code: 'TUR', name: 'Turquia', flag: '🇹🇷' },
  ],
  E: [
    { code: 'GER', name: 'Alemanha', flag: '🇩🇪' },
    { code: 'CUW', name: 'Curaçao', flag: '🇨🇼' },
    { code: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮' },
    { code: 'ECU', name: 'Equador', flag: '🇪🇨' },
  ],
  F: [
    { code: 'NED', name: 'Holanda', flag: '🇳🇱' },
    { code: 'JPN', name: 'Japão', flag: '🇯🇵' },
    { code: 'SWE', name: 'Suécia', flag: '🇸🇪' },
    { code: 'TUN', name: 'Tunísia', flag: '🇹🇳' },
  ],
  G: [
    { code: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
    { code: 'EGY', name: 'Egito', flag: '🇪🇬' },
    { code: 'IRN', name: 'Irã', flag: '🇮🇷' },
    { code: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿' },
  ],
  H: [
    { code: 'ESP', name: 'Espanha', flag: '🇪🇸' },
    { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' },
    { code: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦' },
    { code: 'URU', name: 'Uruguai', flag: '🇺🇾' },
  ],
  I: [
    { code: 'FRA', name: 'França', flag: '🇫🇷' },
    { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
    { code: 'IRQ', name: 'Iraque', flag: '🇮🇶' },
    { code: 'NOR', name: 'Noruega', flag: '🇳🇴' },
  ],
  J: [
    { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
    { code: 'ALG', name: 'Argélia', flag: '🇩🇿' },
    { code: 'AUT', name: 'Áustria', flag: '🇦🇹' },
    { code: 'JOR', name: 'Jordânia', flag: '🇯🇴' },
  ],
  K: [
    { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
    { code: 'COD', name: 'RD Congo', flag: '🇨🇩' },
    { code: 'UZB', name: 'Uzbequistão', flag: '🇺🇿' },
    { code: 'COL', name: 'Colômbia', flag: '🇨🇴' },
  ],
  L: [
    { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'CRO', name: 'Croácia', flag: '🇭🇷' },
    { code: 'GHA', name: 'Gana', flag: '🇬🇭' },
    { code: 'PAN', name: 'Panamá', flag: '🇵🇦' },
  ],
};

const ALL_TEAMS = Object.entries(GROUPS).flatMap(([group, teams]) =>
  teams.map((t) => ({ ...t, group }))
);

const TOTAL_STICKERS = ALL_TEAMS.length * STICKERS_PER_TEAM;

// ─── Tela de Login ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handle = async () => {
    if (!email || !password) { setError('Preencha email e senha.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Conta criada! Você já está logado.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginStyles.wrap}>
      <div style={loginStyles.card}>
        <div style={loginStyles.eyebrow}>FIFA WORLD CUP 2026™</div>
        <h1 style={loginStyles.title}>Álbum Compartilhado</h1>
        <p style={loginStyles.hint}>
          {isRegister ? 'Crie sua conta para começar' : 'Entre para ver o álbum da família'}
        </p>

        {error && <div style={loginStyles.error}>{error}</div>}
        {success && <div style={loginStyles.successMsg}>{success}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          style={loginStyles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          style={loginStyles.input}
        />
        <button onClick={handle} disabled={loading} style={loginStyles.btn}>
          {loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}
        </button>
        <button onClick={() => { setIsRegister(!isRegister); setError(''); }} style={loginStyles.toggle}>
          {isRegister ? 'Já tenho conta — Entrar' : 'Não tenho conta — Criar'}
        </button>
      </div>
    </div>
  );
}

const loginStyles = {
  wrap: { minHeight: '100vh', background: '#003a70', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif" },
  card: { background: '#fff', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  eyebrow: { fontSize: '11px', letterSpacing: '2px', color: '#888', textAlign: 'center' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', margin: 0, textAlign: 'center', color: '#003a70', letterSpacing: '1px' },
  hint: { fontSize: '14px', color: '#666', textAlign: 'center', margin: 0 },
  input: { padding: '12px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit' },
  btn: { padding: '13px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  toggle: { background: 'none', border: 'none', color: '#0055a4', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', fontFamily: 'inherit' },
  error: { background: '#fef2f2', color: '#c5331a', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' },
  successMsg: { background: '#f0fdf4', color: '#0a7a3f', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' },
};

// ─── App Principal ────────────────────────────────────────────────────────────
export default function AlbumApp() {
  const [session, setSession] = useState(undefined); // undefined = carregando
  const [albumId, setAlbumId] = useState(null);
  const [collection, setCollection] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('collection');
  const [filter, setFilter] = useState({ group: 'all', team: 'all' });
  const [feedback, setFeedback] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult, setPhotoResult] = useState(null);
  const fileInputRef = useRef(null);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // ── Carregar/criar álbum ao logar ─────────────────────────────────────────
  useEffect(() => {
    if (!session) { setAlbumId(null); setCollection({}); return; }
    loadAlbum();
  }, [session]);

  const loadAlbum = async () => {
    setLoadingData(true);
    try {
      // Busca álbum do qual este usuário é membro
      const { data: memberships } = await supabase
        .from('album_members')
        .select('album_id')
        .eq('user_id', session.user.id)
        .limit(1);

      let aid = memberships?.[0]?.album_id;

      if (!aid) {
        // Cria álbum novo e adiciona o usuário como membro
        const { data: album } = await supabase
          .from('albums')
          .insert({ name: 'Álbum Copa 2026' })
          .select()
          .single();
        aid = album.id;
        await supabase.from('album_members').insert({ album_id: aid, user_id: session.user.id });
      }

      setAlbumId(aid);
      await fetchStickers(aid);
    } catch (e) {
      console.error('Erro ao carregar álbum:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStickers = async (aid) => {
    const { data } = await supabase
      .from('stickers')
      .select('code, count')
      .eq('album_id', aid);
    const col = {};
    data?.forEach(({ code, count }) => { col[code] = count; });
    setCollection(col);
  };

  // ── Realtime: atualiza quando o irmão mexer ───────────────────────────────
  useEffect(() => {
    if (!albumId) return;
    const channel = supabase
      .channel(`album-${albumId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers', filter: `album_id=eq.${albumId}` },
        () => fetchStickers(albumId)
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [albumId]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2500);
  };

  const parseSticker = (raw) => {
    const cleaned = raw.trim().toUpperCase().replace(/[\s-]/g, '');
    const match = cleaned.match(/^([A-Z]{2,4})(\d{1,3})$/);
    if (!match) return null;
    const [, code, num] = match;
    const team = ALL_TEAMS.find((t) => t.code === code);
    if (!team) return null;
    const number = parseInt(num);
    if (number < 1 || number > STICKERS_PER_TEAM) return null;
    return { code, number, team };
  };

  // ── Upsert no Supabase ────────────────────────────────────────────────────
  const upsertSticker = async (key, newCount) => {
    if (newCount <= 0) {
      await supabase.from('stickers').delete().eq('album_id', albumId).eq('code', key);
    } else {
      await supabase.from('stickers').upsert(
        { album_id: albumId, code: key, count: newCount, added_by: session.user.id, updated_at: new Date().toISOString() },
        { onConflict: 'album_id,code' }
      );
    }
  };

  const addSticker = async (rawInput) => {
    const entries = rawInput.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
    let added = 0; let invalid = [];
    const newCollection = { ...collection };

    for (const entry of entries) {
      const parsed = parseSticker(entry);
      if (!parsed) { invalid.push(entry); continue; }
      const key = `${parsed.code}${parsed.number}`;
      newCollection[key] = (newCollection[key] || 0) + 1;
      added++;
    }

    setCollection(newCollection);

    // Salva no banco (em paralelo)
    const promises = entries
      .map(e => parseSticker(e))
      .filter(Boolean)
      .map(parsed => {
        const key = `${parsed.code}${parsed.number}`;
        return upsertSticker(key, newCollection[key]);
      });
    await Promise.all(promises);

    if (added > 0 && invalid.length === 0) showFeedback(`${added} figurinha${added > 1 ? 's' : ''} adicionada${added > 1 ? 's' : ''}!`);
    else if (added > 0) showFeedback(`${added} adicionadas. Inválidas: ${invalid.join(', ')}`, 'warning');
    else showFeedback(`Formato inválido: ${invalid.join(', ')}`, 'error');
  };

  const handleSubmit = () => { if (!input.trim()) return; addSticker(input); setInput(''); };

  const addStickerByKey = async (key) => {
    const newCount = (collection[key] || 0) + 1;
    setCollection(prev => ({ ...prev, [key]: newCount }));
    await upsertSticker(key, newCount);
    showFeedback(`${key} adicionada!`);
  };

  const removeOne = async (key) => {
    const newCount = (collection[key] || 1) - 1;
    const newCollection = { ...collection };
    if (newCount <= 0) delete newCollection[key]; else newCollection[key] = newCount;
    setCollection(newCollection);
    await upsertSticker(key, newCount);
  };

  const setCount = async (key, count) => {
    const newCollection = { ...collection };
    if (count <= 0) delete newCollection[key]; else newCollection[key] = count;
    setCollection(newCollection);
    await upsertSticker(key, count);
  };

  // ── Foto / IA ─────────────────────────────────────────────────────────────
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true); setPhotoResult(null);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = () => rej(new Error('Falha ao ler arquivo'));
        r.readAsDataURL(file);
      });
      const validCodes = ALL_TEAMS.map(t => t.code).join(', ');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{
            role: 'user', content: [
              { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
              { type: 'text', text: `Identifique todas as figurinhas da Copa do Mundo 2026 (Panini) nesta imagem. Cada figurinha tem um código no formato SIGLA+NÚMERO (ex: BRA12, ARG5, FRA18). Códigos válidos: ${validCodes}. Números vão de 1 a ${STICKERS_PER_TEAM}. Responda APENAS um JSON no formato {"stickers": ["BRA12", "ARG5"]}, sem texto extra, sem markdown, sem backticks. Se não identificar nenhuma, retorne {"stickers": []}.` }
            ]
          }]
        }),
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === 'text')?.text || '';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      if (parsed.stickers?.length > 0) setPhotoResult(parsed.stickers);
      else showFeedback('Nenhuma figurinha identificada na foto', 'warning');
    } catch (err) {
      showFeedback('Erro ao processar foto. Tente novamente.', 'error');
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const confirmPhotoStickers = () => { addSticker(photoResult.join(' ')); setPhotoResult(null); };

  // ── Estatísticas ──────────────────────────────────────────────────────────
  const uniqueCount = Object.keys(collection).length;
  const totalCount = Object.values(collection).reduce((a, b) => a + b, 0);
  const repeats = Object.entries(collection).filter(([, count]) => count > 1);
  const repeatCount = repeats.reduce((acc, [, count]) => acc + (count - 1), 0);
  const progressPct = ((uniqueCount / TOTAL_STICKERS) * 100).toFixed(1);

  const filteredTeams = ALL_TEAMS.filter(t => {
    if (filter.group !== 'all' && t.group !== filter.group) return false;
    if (filter.team !== 'all' && t.code !== filter.team) return false;
    return true;
  });

  const teamProgress = (code) => {
    let owned = 0;
    for (let i = 1; i <= STICKERS_PER_TEAM; i++) if (collection[`${code}${i}`]) owned++;
    return owned;
  };

  // ── Guards de renderização ────────────────────────────────────────────────
  if (session === undefined) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#003a70', color: '#fff' }}>Carregando...</div>;
  if (!session) return <LoginScreen />;
  if (loadingData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#f4f1ea' }}>Carregando álbum...</div>;

  // ── Render principal ──────────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.eyebrow}>FIFA WORLD CUP 2026™ · Álbum Compartilhado</div>
            <h1 style={styles.title}>Meu Álbum</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={styles.statBlock}>
              <div style={styles.statBig}>{progressPct}%</div>
              <div style={styles.statSmall}>{uniqueCount} / {TOTAL_STICKERS}</div>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              title="Sair"
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>
      </header>

      <nav style={styles.tabs}>
        {[
          { id: 'input', label: 'Adicionar', icon: Plus },
          { id: 'collection', label: 'Coleção', icon: Filter },
          { id: 'repeats', label: `Repetidas${repeatCount > 0 ? ` (${repeatCount})` : ''}`, icon: ArrowLeftRight },
          { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
          { id: 'invite', label: 'Convidar', icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ ...styles.tab, ...(activeTab === id ? styles.tabActive : {}) }}>
            <Icon size={16} /><span>{label}</span>
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {feedback && (
          <div style={{ ...styles.feedback, ...(feedback.type === 'error' ? styles.feedbackError : {}), ...(feedback.type === 'warning' ? styles.feedbackWarning : {}) }}>
            {feedback.msg}
          </div>
        )}

        {/* ── ABA: ADICIONAR ─────────────────────────────────────────────── */}
        {activeTab === 'input' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Digitar figurinhas</h2>
              <p style={styles.cardHint}>Formato: <code style={styles.code}>SIGLA + NÚMERO</code>. Ex: <code style={styles.code}>BRA12</code>. Para várias: <code style={styles.code}>BRA1 ARG5 FRA18</code></p>
              <div style={styles.inputRow}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="BRA12, ARG5, FRA18..." style={styles.input} />
                <button onClick={handleSubmit} style={styles.primaryBtn}>Adicionar</button>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Importar por foto</h2>
              <p style={styles.cardHint}>Tire uma foto das figurinhas. A IA tenta identificar os códigos automaticamente.</p>
              {!photoResult && (
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={photoLoading} style={{ ...styles.primaryBtn, ...styles.photoBtn, ...(photoLoading ? styles.btnDisabled : {}) }}>
                    {photoLoading ? <><Loader2 size={18} className="spin" />Analisando...</> : <><Camera size={18} />Tirar foto / Escolher imagem</>}
                  </button>
                </div>
              )}
              {photoResult && (
                <div style={styles.photoResultBox}>
                  <div style={styles.photoResultHeader}><Check size={18} color="#0a7a3f" /><strong>Identificadas {photoResult.length} figurinhas:</strong></div>
                  <div style={styles.photoChipRow}>{photoResult.map((code, i) => <span key={i} style={styles.photoChip}>{code}</span>)}</div>
                  <div style={styles.photoActions}>
                    <button onClick={confirmPhotoStickers} style={styles.primaryBtn}>Adicionar todas</button>
                    <button onClick={() => setPhotoResult(null)} style={styles.secondaryBtn}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ABA: COLEÇÃO ───────────────────────────────────────────────── */}
        {activeTab === 'collection' && (
          <div style={styles.section}>
            <div style={styles.helpBox}>
              <strong>Como usar:</strong> clique na figurinha para adicionar. Para remover, segure <kbd style={styles.kbd}>Shift</kbd> + clique, ou clique com o botão direito.
            </div>
            <div style={styles.filterRow}>
              <select value={filter.group} onChange={e => setFilter({ group: e.target.value, team: 'all' })} style={styles.select}>
                <option value="all">Todos os grupos</option>
                {Object.keys(GROUPS).map(g => <option key={g} value={g}>Grupo {g}</option>)}
              </select>
              <select value={filter.team} onChange={e => setFilter({ ...filter, team: e.target.value })} style={styles.select}>
                <option value="all">Todas as seleções</option>
                {(filter.group === 'all' ? ALL_TEAMS : GROUPS[filter.group]).map(t => <option key={t.code} value={t.code}>{t.flag} {t.name}</option>)}
              </select>
            </div>
            {filteredTeams.map(team => {
              const owned = teamProgress(team.code);
              return (
                <div key={team.code} style={styles.teamCard}>
                  <div style={styles.teamHeader}>
                    <div style={styles.teamHeaderLeft}>
                      <span style={styles.teamFlag}>{team.flag}</span>
                      <div>
                        <div style={styles.teamName}>{team.name}</div>
                        <div style={styles.teamMeta}>Grupo {team.group} · {team.code}</div>
                      </div>
                    </div>
                    <div style={styles.teamProgress}><strong>{owned}</strong><span>/{STICKERS_PER_TEAM}</span></div>
                  </div>
                  <div style={styles.stickerGrid}>
                    {Array.from({ length: STICKERS_PER_TEAM }, (_, i) => {
                      const num = i + 1;
                      const key = `${team.code}${num}`;
                      const count = collection[key] || 0;
                      return (
                        <button key={num}
                          style={{ ...styles.stickerCell, ...(count > 0 ? styles.stickerOwned : {}), ...(count > 1 ? styles.stickerDuplicate : {}) }}
                          title={count > 0 ? `${key} — ${count}x. Clique para adicionar, SHIFT para remover` : `${key}. Clique para adicionar`}
                          onClick={e => { if (e.shiftKey && count > 0) removeOne(key); else addStickerByKey(key); }}
                          onContextMenu={e => { e.preventDefault(); if (count > 0) removeOne(key); }}
                        >
                          <span style={styles.stickerCode}>{team.code}</span>
                          <span style={styles.stickerNum}>{num}</span>
                          {count > 1 && <span style={styles.stickerBadge}>{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ABA: REPETIDAS ─────────────────────────────────────────────── */}
        {activeTab === 'repeats' && (
          <div style={styles.section}>
            <div style={styles.helpBox}>
              <strong>Trocou figurinhas?</strong> Use <kbd style={styles.kbd}>−</kbd> e <kbd style={styles.kbd}>+</kbd> pra ajustar. O botão <strong>Troquei todas</strong> remove as cópias extras.
            </div>
            <div style={styles.card}>
              <div style={styles.repeatsHeader}>
                <h2 style={styles.cardTitle}>Repetidas {repeatCount > 0 && `(${repeatCount})`}</h2>
                {repeats.length > 0 && (
                  <button onClick={async () => {
                    if (confirm(`Remover todas as ${repeatCount} cópias extras?`)) {
                      const newCollection = { ...collection };
                      for (const [key] of repeats) { newCollection[key] = 1; await upsertSticker(key, 1); }
                      setCollection(newCollection);
                      showFeedback(`${repeatCount} repetidas removidas!`);
                    }
                  }} style={styles.dangerBtn}>Limpar todas</button>
                )}
              </div>
              {repeats.length === 0 ? (
                <p style={styles.empty}>Nenhuma repetida ainda. Bora colar!</p>
              ) : (
                <div style={styles.repeatsList}>
                  {repeats.sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => {
                    const match = key.match(/^([A-Z]+)(\d+)$/);
                    const team = ALL_TEAMS.find(t => t.code === match[1]);
                    return (
                      <div key={key} style={styles.repeatRow}>
                        <div style={styles.repeatLeft}>
                          <span style={styles.repeatFlag}>{team?.flag}</span>
                          <div>
                            <div style={styles.repeatCode}>{key}</div>
                            <div style={styles.repeatTeam}>{team?.name}</div>
                          </div>
                        </div>
                        <div style={styles.repeatRight}>
                          <div style={styles.stepper}>
                            <button onClick={() => removeOne(key)} style={styles.stepBtn}>−</button>
                            <span style={styles.stepCount}>{count}</span>
                            <button onClick={() => addStickerByKey(key)} style={styles.stepBtn}>+</button>
                          </div>
                          <button onClick={async () => { await setCount(key, 1); showFeedback(`${count - 1} cópia${count - 1 > 1 ? 's' : ''} de ${key} removida${count - 1 > 1 ? 's' : ''}!`); }} style={styles.tradeBtn}>Troquei todas</button>
                          <button onClick={() => setCount(key, 0)} style={styles.iconBtn} title="Remover figurinha"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ABA: ESTATÍSTICAS ──────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div style={styles.section}>
            <div style={styles.statsGrid}>
              {[
                { label: 'Coladas (únicas)', value: uniqueCount, footer: `de ${TOTAL_STICKERS}` },
                { label: 'Total na coleção', value: totalCount, footer: 'incluindo repetidas' },
                { label: 'Repetidas', value: repeatCount, footer: 'para troca' },
                { label: 'Faltam', value: TOTAL_STICKERS - uniqueCount, footer: 'figurinhas' },
              ].map(s => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statLabel}>{s.label}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statFooter}>{s.footer}</div>
                </div>
              ))}
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Progresso por seleção</h2>
              <div style={styles.progressList}>
                {ALL_TEAMS.map(team => {
                  const owned = teamProgress(team.code);
                  const pct = (owned / STICKERS_PER_TEAM) * 100;
                  return (
                    <div key={team.code} style={styles.progressRow}>
                      <div style={styles.progressLabel}><span>{team.flag}</span><span>{team.name}</span></div>
                      <div style={styles.progressBarSm}><div style={{ ...styles.progressFillSm, width: `${pct}%`, ...(pct === 100 ? { background: '#0a7a3f' } : {}) }} /></div>
                      <div style={styles.progressNum}>{owned}/{STICKERS_PER_TEAM}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ABA: CONVIDAR ──────────────────────────────────────────────── */}
        {activeTab === 'invite' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Convidar para o álbum</h2>
              <p style={styles.cardHint}>
                Peça para seu irmão criar uma conta no app primeiro. Depois cole o email dele abaixo para dar acesso ao álbum compartilhado.
              </p>
              <InviteForm albumId={albumId} showFeedback={showFeedback} />
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Sua conta</h2>
              <p style={styles.cardHint}>Logado como: <strong>{session.user.email}</strong></p>
              <button onClick={() => supabase.auth.signOut()} style={{ ...styles.primaryBtn, background: '#c5331a' }}>
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        Álbum compartilhado · sincronizado em tempo real · 48 seleções · {TOTAL_STICKERS} figurinhas
      </footer>
    </div>
  );
}

// ─── Componente de convite ────────────────────────────────────────────────────
function InviteForm({ albumId, showFeedback }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const invite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      // Busca o user_id pelo email na tabela auth.users via RPC ou diretamente
      const { data: users, error } = await supabase
        .from('profiles') // veja nota abaixo
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .limit(1);

      if (error || !users?.length) {
        showFeedback('Usuário não encontrado. Ele precisa criar a conta primeiro.', 'error');
        return;
      }

      const userId = users[0].id;
      const { error: memberError } = await supabase
        .from('album_members')
        .insert({ album_id: albumId, user_id: userId });

      if (memberError?.code === '23505') {
        showFeedback('Este usuário já tem acesso ao álbum.', 'warning');
      } else if (memberError) {
        throw memberError;
      } else {
        showFeedback(`${email} adicionado ao álbum!`);
        setEmail('');
      }
    } catch (e) {
      showFeedback('Erro ao convidar. Tente novamente.', 'error');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.inputRow}>
      <input type="email" placeholder="email do seu irmão" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && invite()} style={styles.input} />
      <button onClick={invite} disabled={loading} style={styles.primaryBtn}>{loading ? 'Aguarde...' : 'Convidar'}</button>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  input, select, button { font-family: inherit; }
  input::placeholder { color: #999; }
  button:hover:not(:disabled) { opacity: 0.9; }
  button:active:not(:disabled) { transform: translateY(1px); }
`;

const styles = {
  app: { fontFamily: "'DM Sans', sans-serif", background: '#f4f1ea', minHeight: '100vh', color: '#1a1a1a', paddingBottom: '40px' },
  header: { background: 'linear-gradient(135deg, #003a70 0%, #0055a4 100%)', color: '#fff', padding: '24px 20px 0', position: 'relative', overflow: 'hidden' },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '900px', margin: '0 auto', paddingBottom: '16px' },
  eyebrow: { fontSize: '11px', letterSpacing: '2px', opacity: 0.8, marginBottom: '4px' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px', margin: 0, letterSpacing: '1px', lineHeight: 1 },
  statBlock: { textAlign: 'right' },
  statBig: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', lineHeight: 1, color: '#ffd400' },
  statSmall: { fontSize: '12px', opacity: 0.8, marginTop: '2px' },
  progressBar: { height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden', maxWidth: '900px', margin: '0 auto' },
  progressFill: { height: '100%', background: '#ffd400', transition: 'width 0.3s ease' },
  tabs: { display: 'flex', gap: '4px', padding: '12px 20px', overflowX: 'auto', background: '#fff', borderBottom: '1px solid #e5e1d8', maxWidth: '900px', margin: '0 auto' },
  tab: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: 'none', background: 'transparent', color: '#666', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', whiteSpace: 'nowrap' },
  tabActive: { background: '#003a70', color: '#fff' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e5e1d8' },
  cardTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', margin: '0 0 8px', letterSpacing: '0.5px' },
  cardHint: { fontSize: '13px', color: '#666', margin: '0 0 16px', lineHeight: 1.5 },
  code: { background: '#f4f1ea', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '12px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '15px', outline: 'none', textTransform: 'uppercase' },
  primaryBtn: { padding: '12px 20px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
  secondaryBtn: { padding: '12px 20px', background: '#fff', color: '#1a1a1a', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  photoBtn: { width: '100%', justifyContent: 'center', padding: '14px' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  photoResultBox: { background: '#f4f1ea', padding: '16px', borderRadius: '8px' },
  photoResultHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px' },
  photoChipRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  photoChip: { background: '#fff', border: '1px solid #003a70', color: '#003a70', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' },
  photoActions: { display: 'flex', gap: '8px' },
  feedback: { background: '#0a7a3f', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 },
  feedbackError: { background: '#c5331a' },
  feedbackWarning: { background: '#d97706' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  helpBox: { background: '#fff8e1', border: '1px solid #f5d782', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#5c4a14', lineHeight: 1.5 },
  kbd: { background: '#fff', border: '1px solid #d4cdc0', borderRadius: '4px', padding: '1px 6px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 },
  select: { padding: '10px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '14px', background: '#fff', flex: 1, minWidth: '140px', cursor: 'pointer' },
  teamCard: { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e1d8' },
  teamHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  teamHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  teamFlag: { fontSize: '32px' },
  teamName: { fontWeight: 700, fontSize: '16px' },
  teamMeta: { fontSize: '12px', color: '#888', marginTop: '2px' },
  teamProgress: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px' },
  stickerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: '6px' },
  stickerCell: { aspectRatio: '1', border: '2px dashed #d4cdc0', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', color: '#aaa', position: 'relative', cursor: 'pointer', background: 'transparent', padding: '2px', transition: 'transform 0.1s, background 0.15s', fontFamily: 'inherit' },
  stickerOwned: { background: '#003a70', border: '2px solid #003a70', color: '#fff' },
  stickerDuplicate: { background: '#d97706', border: '2px solid #d97706' },
  stickerCode: { fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', opacity: 0.85, lineHeight: 1 },
  stickerNum: { fontWeight: 700, fontSize: '14px', lineHeight: 1 },
  stickerBadge: { position: 'absolute', top: '-6px', right: '-6px', background: '#1a1a1a', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 5px', borderRadius: '8px', minWidth: '16px', textAlign: 'center' },
  empty: { color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px', margin: 0 },
  repeatsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  repeatsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
  stepper: { display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #d4cdc0', borderRadius: '8px', overflow: 'hidden' },
  stepBtn: { background: 'transparent', border: 'none', padding: '6px 12px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', color: '#003a70', minWidth: '32px' },
  stepCount: { padding: '0 10px', fontWeight: 700, fontSize: '14px', minWidth: '24px', textAlign: 'center', borderLeft: '1px solid #e5e1d8', borderRight: '1px solid #e5e1d8', fontFamily: 'monospace' },
  tradeBtn: { background: '#0a7a3f', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  dangerBtn: { background: '#fff', color: '#c5331a', border: '1px solid #c5331a', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  repeatRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f4f1ea', borderRadius: '8px' },
  repeatLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  repeatFlag: { fontSize: '24px' },
  repeatCode: { fontFamily: 'monospace', fontWeight: 700, fontSize: '14px' },
  repeatTeam: { fontSize: '12px', color: '#666', marginTop: '2px' },
  repeatRight: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  iconBtn: { background: 'transparent', border: '1px solid #d4cdc0', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e1d8' },
  statLabel: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '6px' },
  statValue: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', lineHeight: 1, color: '#003a70' },
  statFooter: { fontSize: '12px', color: '#888', marginTop: '4px' },
  progressList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  progressRow: { display: 'grid', gridTemplateColumns: '1fr 2fr auto', alignItems: 'center', gap: '12px', fontSize: '13px' },
  progressLabel: { display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  progressBarSm: { height: '8px', background: '#f4f1ea', borderRadius: '4px', overflow: 'hidden' },
  progressFillSm: { height: '100%', background: '#0055a4', transition: 'width 0.3s' },
  progressNum: { fontFamily: 'monospace', fontSize: '12px', color: '#666', minWidth: '40px', textAlign: 'right' },
  footer: { textAlign: 'center', padding: '20px', fontSize: '12px', color: '#888' },
};