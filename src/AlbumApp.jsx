import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Filter, BarChart3, ArrowLeftRight, Camera, X, Loader2, Check, LogOut, Users, Copy, PlusCircle, LogIn } from 'lucide-react';
import { supabase } from './supabaseClient';

const STICKERS_PER_TEAM = 20;

const GROUPS = {
  A: [{ code: 'MEX', name: 'México', flag: '🇲🇽' }, { code: 'RSA', name: 'África do Sul', flag: '🇿🇦' }, { code: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷' }, { code: 'CZE', name: 'República Tcheca', flag: '🇨🇿' }],
  B: [{ code: 'CAN', name: 'Canadá', flag: '🇨🇦' }, { code: 'BIH', name: 'Bósnia e Herzegovina', flag: '🇧🇦' }, { code: 'QAT', name: 'Catar', flag: '🇶🇦' }, { code: 'SUI', name: 'Suíça', flag: '🇨🇭' }],
  C: [{ code: 'BRA', name: 'Brasil', flag: '🇧🇷' }, { code: 'MAR', name: 'Marrocos', flag: '🇲🇦' }, { code: 'HAI', name: 'Haiti', flag: '🇭🇹' }, { code: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }],
  D: [{ code: 'USA', name: 'Estados Unidos', flag: '🇺🇸' }, { code: 'PAR', name: 'Paraguai', flag: '🇵🇾' }, { code: 'AUS', name: 'Austrália', flag: '🇦🇺' }, { code: 'TUR', name: 'Turquia', flag: '🇹🇷' }],
  E: [{ code: 'GER', name: 'Alemanha', flag: '🇩🇪' }, { code: 'CUW', name: 'Curaçao', flag: '🇨🇼' }, { code: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮' }, { code: 'ECU', name: 'Equador', flag: '🇪🇨' }],
  F: [{ code: 'NED', name: 'Holanda', flag: '🇳🇱' }, { code: 'JPN', name: 'Japão', flag: '🇯🇵' }, { code: 'SWE', name: 'Suécia', flag: '🇸🇪' }, { code: 'TUN', name: 'Tunísia', flag: '🇹🇳' }],
  G: [{ code: 'BEL', name: 'Bélgica', flag: '🇧🇪' }, { code: 'EGY', name: 'Egito', flag: '🇪🇬' }, { code: 'IRN', name: 'Irã', flag: '🇮🇷' }, { code: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿' }],
  H: [{ code: 'ESP', name: 'Espanha', flag: '🇪🇸' }, { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' }, { code: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦' }, { code: 'URU', name: 'Uruguai', flag: '🇺🇾' }],
  I: [{ code: 'FRA', name: 'França', flag: '🇫🇷' }, { code: 'SEN', name: 'Senegal', flag: '🇸🇳' }, { code: 'IRQ', name: 'Iraque', flag: '🇮🇶' }, { code: 'NOR', name: 'Noruega', flag: '🇳🇴' }],
  J: [{ code: 'ARG', name: 'Argentina', flag: '🇦🇷' }, { code: 'ALG', name: 'Argélia', flag: '🇩🇿' }, { code: 'AUT', name: 'Áustria', flag: '🇦🇹' }, { code: 'JOR', name: 'Jordânia', flag: '🇯🇴' }],
  K: [{ code: 'POR', name: 'Portugal', flag: '🇵🇹' }, { code: 'COD', name: 'RD Congo', flag: '🇨🇩' }, { code: 'UZB', name: 'Uzbequistão', flag: '🇺🇿' }, { code: 'COL', name: 'Colômbia', flag: '🇨🇴' }],
  L: [{ code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { code: 'CRO', name: 'Croácia', flag: '🇭🇷' }, { code: 'GHA', name: 'Gana', flag: '🇬🇭' }, { code: 'PAN', name: 'Panamá', flag: '🇵🇦' }],
};

const ALL_TEAMS = Object.entries(GROUPS).flatMap(([group, teams]) => teams.map((t) => ({ ...t, group })));
const TOTAL_STICKERS = ALL_TEAMS.length * STICKERS_PER_TEAM;

// ─── Tela de Login ───────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!email || !password) { setError('Preencha email e senha.'); return; }
    setLoading(true); setError('');
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={loginStyles.wrap}>
      <div style={loginStyles.card}>
        <div style={loginStyles.eyebrow}>FIFA WORLD CUP 2026™</div>
        <h1 style={loginStyles.title}>Álbum Compartilhado</h1>
        {error && <div style={loginStyles.error}>{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={loginStyles.input} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} style={loginStyles.input} />
        <button onClick={handle} disabled={loading} style={loginStyles.btn}>{loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}</button>
        <button onClick={() => setIsRegister(!isRegister)} style={loginStyles.toggle}>{isRegister ? 'Já tenho conta — Entrar' : 'Não tenho conta — Criar'}</button>
      </div>
    </div>
  );
}

const loginStyles = {
  wrap: { minHeight: '100vh', background: '#003a70', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif" },
  card: { background: '#fff', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  eyebrow: { fontSize: '11px', letterSpacing: '2px', color: '#888', textAlign: 'center' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', margin: 0, textAlign: 'center', color: '#003a70', letterSpacing: '1px' },
  input: { padding: '12px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '15px', outline: 'none' },
  btn: { padding: '13px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
  toggle: { background: 'none', border: 'none', color: '#0055a4', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' },
  error: { background: '#fef2f2', color: '#c5331a', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' },
};

// ─── App Principal ────────────────────────────────────────────────────────────
export default function AlbumApp() {
  const [session, setSession] = useState(undefined);
  const [userAlbums, setUserAlbums] = useState([]);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setAlbumId(null); setUserAlbums([]); setCollection({}); return; }
    loadUserAlbums();
  }, [session]);

  const loadUserAlbums = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('album_members')
        .select('album_id, albums(id, name, invite_code)')
        .eq('user_id', session.user.id);

      if (error) throw error;
      const albums = data.map(item => item.albums);
      setUserAlbums(albums);

      if (albums.length > 0) {
        const initialAid = albums[0].id;
        setAlbumId(initialAid);
        await fetchStickers(initialAid);
      } else {
        // Se o usuário for novo e não tiver álbum, cria um padrão
        await createNewAlbum('Meu Álbum Copa');
      }
    } catch (e) { console.error(e); } finally { setLoadingData(false); }
  };

  const fetchStickers = async (aid) => {
    const { data } = await supabase.from('stickers').select('code, count').eq('album_id', aid);
    const col = {};
    data?.forEach(({ code, count }) => { col[code] = count; });
    setCollection(col);
  };

  const createNewAlbum = async (name) => {
    if (!name.trim()) return;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data: album } = await supabase.from('albums').insert({ name, invite_code: inviteCode }).select().single();
    await supabase.from('album_members').insert({ album_id: album.id, user_id: session.user.id });
    showFeedback(`Álbum "${name}" criado!`);
    loadUserAlbums();
  };

  const joinByCode = async (code) => {
    const cleanCode = code.trim().toUpperCase();
    const { data: album, error: searchErr } = await supabase.from('albums').select('id, name').eq('invite_code', cleanCode).single();
    if (searchErr || !album) return showFeedback('Código inválido', 'error');

    const { error: joinErr } = await supabase.from('album_members').insert({ album_id: album.id, user_id: session.user.id });
    if (joinErr?.code === '23505') return showFeedback('Você já está neste álbum', 'warning');
    
    showFeedback(`Entrou em: ${album.name}`);
    loadUserAlbums();
  };

  const switchAlbum = (aid) => {
    setAlbumId(aid);
    fetchStickers(aid);
  };

  // Realtime
  useEffect(() => {
    if (!albumId) return;
    const channel = supabase.channel(`album-${albumId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers', filter: `album_id=eq.${albumId}` }, () => fetchStickers(albumId))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [albumId]);

  const showFeedback = (msg, type = 'success') => { setFeedback({ msg, type }); setTimeout(() => setFeedback(null), 2500); };

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

  const addStickerByKey = async (key) => {
    const newCount = (collection[key] || 0) + 1;
    setCollection(prev => ({ ...prev, [key]: newCount }));
    await upsertSticker(key, newCount);
  };

  const removeOne = async (key) => {
    const newCount = (collection[key] || 1) - 1;
    const newCol = { ...collection };
    if (newCount <= 0) delete newCol[key]; else newCol[key] = newCount;
    setCollection(newCol);
    await upsertSticker(key, newCount);
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

  const addSticker = async (rawInput) => {
    const entries = rawInput.split(/[\s,;]+/).filter(Boolean);
    const newCollection = { ...collection };
    for (const entry of entries) {
      const parsed = parseSticker(entry);
      if (parsed) {
        const key = `${parsed.code}${parsed.number}`;
        newCollection[key] = (newCollection[key] || 0) + 1;
        await upsertSticker(key, newCollection[key]);
      }
    }
    setCollection(newCollection);
    showFeedback("Processado!");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    // Simulação ou chamada de API aqui...
    setTimeout(() => { setPhotoLoading(false); showFeedback("Funcionalidade de IA requer chave de API configurada.", "warning"); }, 2000);
  };

  // Stats
  const uniqueCount = Object.keys(collection).length;
  const repeatCount = Object.values(collection).reduce((acc, count) => acc + (count > 1 ? count - 1 : 0), 0);
  const progressPct = ((uniqueCount / TOTAL_STICKERS) * 100).toFixed(1);

  if (session === undefined) return <div style={loadingStyles}>Carregando...</div>;
  if (!session) return <LoginScreen />;

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ flex: 1 }}>
            <div style={styles.eyebrow}>FIFA WORLD CUP 2026™</div>
            <select 
              value={albumId || ''} 
              onChange={(e) => switchAlbum(e.target.value)}
              style={styles.albumSelect}
            >
              {userAlbums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div style={styles.statBlock}>
            <div style={styles.statBig}>{progressPct}%</div>
            <div style={styles.statSmall}>{uniqueCount}/{TOTAL_STICKERS}</div>
          </div>
        </div>
      </header>

      <nav style={styles.tabs}>
        {[
          { id: 'input', label: 'Add', icon: Plus },
          { id: 'collection', label: 'Coleção', icon: Filter },
          { id: 'repeats', label: 'Trocas', icon: ArrowLeftRight },
          { id: 'invite', label: 'Álbuns', icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ ...styles.tab, ...(activeTab === id ? styles.tabActive : {}) }}>
            <Icon size={16} /><span>{label}</span>
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {feedback && <div style={{ ...styles.feedback, ...(styles[`feedback${feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}`]) }}>{feedback.msg}</div>}

        {activeTab === 'input' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Digitar códigos</h2>
              <div style={styles.inputRow}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="BRA1, ARG5..." style={styles.input} />
                <button onClick={() => { addSticker(input); setInput(''); }} style={styles.primaryBtn}>Adicionar</button>
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Importar por Foto</h2>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current.click()} style={styles.photoBtn} disabled={photoLoading}>
                {photoLoading ? <Loader2 className="spin" /> : <Camera />} Tirar Foto
              </button>
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div style={styles.section}>
            <div style={styles.filterRow}>
              <select onChange={e => setFilter({ ...filter, group: e.target.value })} style={styles.select}>
                <option value="all">Grupos</option>
                {Object.keys(GROUPS).map(g => <option key={g} value={g}>Grupo {g}</option>)}
              </select>
            </div>
            {ALL_TEAMS.filter(t => filter.group === 'all' || t.group === filter.group).map(team => (
              <div key={team.code} style={styles.teamCard}>
                <div style={styles.teamHeader}><span>{team.flag} {team.name}</span></div>
                <div style={styles.stickerGrid}>
                  {Array.from({ length: STICKERS_PER_TEAM }, (_, i) => {
                    const key = `${team.code}${i+1}`;
                    const count = collection[key] || 0;
                    return (
                      <button key={i} onClick={() => addStickerByKey(key)} onContextMenu={e => { e.preventDefault(); removeOne(key); }}
                        style={{ ...styles.stickerCell, ...(count > 0 ? styles.stickerOwned : {}), ...(count > 1 ? styles.stickerDuplicate : {}) }}>
                        {i+1} {count > 1 && <span style={styles.stickerBadge}>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'invite' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Convidar Amigos</h2>
              <p style={styles.cardHint}>Código deste álbum para compartilhar:</p>
              <div style={styles.codeDisplay}>
                <code>{userAlbums.find(a => a.id === albumId)?.invite_code}</code>
                <button onClick={() => { navigator.clipboard.writeText(userAlbums.find(a => a.id === albumId)?.invite_code); showFeedback("Copiado!"); }} style={styles.iconBtn}><Copy size={16}/></button>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Entrar em Álbum</h2>
              <div style={styles.inputRow}>
                <input type="text" id="joinInput" placeholder="Código Único" style={styles.input} />
                <button onClick={() => joinByCode(document.getElementById('joinInput').value)} style={styles.primaryBtn}><LogIn size={16}/> Entrar</button>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Criar Novo Álbum</h2>
              <div style={styles.inputRow}>
                <input type="text" id="nameInput" placeholder="Nome do álbum" style={styles.input} />
                <button onClick={() => createNewAlbum(document.getElementById('nameInput').value)} style={styles.primaryBtn}><PlusCircle size={16}/> Criar</button>
              </div>
            </div>

            <button onClick={() => supabase.auth.signOut()} style={{...styles.secondaryBtn, color: 'red'}}>Sair da Conta</button>
          </div>
        )}
      </main>
    </div>
  );
}

const loadingStyles = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#003a70', color: '#fff', fontFamily: 'sans-serif' };

const styles = {
  app: { fontFamily: "'DM Sans', sans-serif", background: '#f4f1ea', minHeight: '100vh', color: '#1a1a1a' },
  header: { background: '#003a70', color: '#fff', padding: '20px' },
  headerInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  albumSelect: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #fff3', padding: '8px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', width: '200px' },
  eyebrow: { fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', marginBottom: '4px' },
  statBlock: { textAlign: 'right' },
  statBig: { fontSize: '28px', fontWeight: 'bold', color: '#ffd400' },
  statSmall: { fontSize: '12px' },
  tabs: { display: 'flex', gap: '5px', padding: '10px', background: '#fff', borderBottom: '1px solid #ddd', overflowX: 'auto' },
  tab: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' },
  tabActive: { background: '#003a70', color: '#fff', borderRadius: '8px' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  section: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e1d8' },
  cardTitle: { fontSize: '18px', margin: '0 0 10px' },
  cardHint: { fontSize: '12px', color: '#666' },
  inputRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' },
  primaryBtn: { background: '#003a70', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  secondaryBtn: { background: '#fff', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', cursor: 'pointer' },
  photoBtn: { width: '100%', padding: '15px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '10px' },
  feedback: { padding: '10px', borderRadius: '8px', marginBottom: '10px', color: '#fff', textAlign: 'center', background: '#0a7a3f' },
  feedbackWarning: { background: '#d97706' },
  feedbackError: { background: '#c5331a' },
  codeDisplay: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f0f0', padding: '10px', borderRadius: '8px', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
  teamCard: { background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #ddd' },
  stickerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))', gap: '5px', marginTop: '10px' },
  stickerCell: { aspectRatio: '1', border: '1px solid #ddd', borderRadius: '4px', background: 'none', fontSize: '12px', position: 'relative' },
  stickerOwned: { background: '#003a70', color: '#fff' },
  stickerDuplicate: { background: '#d97706', color: '#fff' },
  stickerBadge: { position: 'absolute', top: '-5px', right: '-5px', background: '#000', color: '#fff', fontSize: '9px', padding: '2px 4px', borderRadius: '50%' },
  iconBtn: { padding: '5px', border: '1px solid #ddd', background: '#fff', borderRadius: '5px' }
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
  body { margin: 0; padding: 0; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;