import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Filter, BarChart3, ArrowLeftRight, Camera, X, Loader2, Check, LogOut, Users, Copy, PlusCircle, LogIn } from 'lucide-react';
import { supabase } from './supabaseClient';

const STICKERS_PER_TEAM = 20;

const GROUPS = {
  A: [{ code: 'MEX', name: 'México', flag: '🇲🇽' }, { code: 'RSA', name: 'África do Sul', flag: '🇿🇦' }, { code: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷' }, { code: 'CZE', name: 'República Tcheca', flag: '🇨🇿' }],
  B: [{ code: 'CAN', name: 'Canadá', flag: '🇨🇦' }, { code: 'BIH', name: 'Bósnia e Herzegovina', flag: '🇧🇦' }, { code: 'QAT', name: 'Catar', flag: '🇶🇦' }, { code: 'SUI', name: 'Suíça', flag: '🇨🇭' }],
  C: [{ code: 'BRA', name: 'Brasil', flag: '🇧🇷' }, { code: 'MAR', name: 'Marrocos', flag: '🇲🇦' }, { code: 'HAI', name: 'Haiti', flag: '🇭🇹' }, { code: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳蔻󠁴󠁿' }],
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
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={loginStyles.wrap}>
      <div style={loginStyles.card}>
        <div style={loginStyles.eyebrow}>FIFA WORLD CUP 2026™</div>
        <h1 style={loginStyles.title}>Álbum Compartilhado</h1>
        <p style={loginStyles.hint}>{isRegister ? 'Crie sua conta para começar' : 'Entre para ver o álbum da família'}</p>
        {error && <div style={loginStyles.error}>{error}</div>}
        {success && <div style={loginStyles.successMsg}>{success}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={loginStyles.input} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} style={loginStyles.input} />
        <button onClick={handle} disabled={loading} style={loginStyles.btn}>{loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}</button>
        <button onClick={() => { setIsRegister(!isRegister); setError(''); }} style={loginStyles.toggle}>{isRegister ? 'Já tenho conta — Entrar' : 'Não tenho conta — Criar'}</button>
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
  const [session, setSession] = useState(undefined);
  const [userAlbums, setUserAlbums] = useState([]); //
  const [albumId, setAlbumId] = useState(null); //
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
    loadAlbums();
  }, [session]);

  const loadAlbums = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('album_members')
        .select('album_id, albums(id, name, invite_code)')
        .eq('user_id', session.user.id);

      if (error) throw error;
      const albums = data.map(item => item.albums);
      setUserAlbums(albums);

      if (albums.length > 0 && !albumId) {
        setAlbumId(albums[0].id);
        await fetchStickers(albums[0].id);
      } else if (albums.length === 0) {
        await handleCreateAlbum('Meu Álbum Copa');
      } else if (albumId) {
        await fetchStickers(albumId);
      }
    } catch (e) { console.error('Erro ao carregar álbuns:', e); } finally { setLoadingData(false); }
  };

  const fetchStickers = async (aid) => {
    const { data } = await supabase.from('stickers').select('code, count').eq('album_id', aid);
    const col = {};
    data?.forEach(({ code, count }) => { col[code] = count; });
    setCollection(col);
  };

  // Realtime: atualiza quando o irmão mexer
  useEffect(() => {
    if (!albumId) return;
    const channel = supabase.channel(`album-${albumId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers', filter: `album_id=eq.${albumId}` }, () => fetchStickers(albumId))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [albumId]);

  const showFeedback = (msg, type = 'success') => { setFeedback({ msg, type }); setTimeout(() => setFeedback(null), 2500); };

  const handleCreateAlbum = async (name) => {
    if (!name.trim()) return;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data: album } = await supabase.from('albums').insert({ name, invite_code: inviteCode }).select().single();
    await supabase.from('album_members').insert({ album_id: album.id, user_id: session.user.id });
    showFeedback(`Álbum "${name}" criado!`);
    loadAlbums();
  };

  const handleJoinAlbum = async (code) => {
    const cleanCode = code.trim().toUpperCase();
    const { data: album, error } = await supabase.from('albums').select('id, name').eq('invite_code', cleanCode).single();
    if (error || !album) return showFeedback('Código não encontrado', 'error');
    
    const { error: joinErr } = await supabase.from('album_members').insert({ album_id: album.id, user_id: session.user.id });
    if (joinErr?.code === '23505') return showFeedback('Você já está neste álbum', 'warning');
    
    showFeedback(`Bem-vindo ao álbum: ${album.name}`);
    setAlbumId(album.id);
    loadAlbums();
  };

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
    const promises = entries.map(e => parseSticker(e)).filter(Boolean).map(p => upsertSticker(`${p.code}${p.number}`, newCollection[`${p.code}${p.number}`]));
    await Promise.all(promises);
    if (added > 0 && invalid.length === 0) showFeedback(`${added} figurinha(s) adicionada(s)!`);
    else if (added > 0) showFeedback(`${added} adicionadas. Inválidas: ${invalid.join(', ')}`, 'warning');
  };

  const parseSticker = (raw) => {
    const cleaned = raw.trim().toUpperCase().replace(/[\s-]/g, '');
    const match = cleaned.match(/^([A-Z]{2,4})(\d{1,3})$/);
    if (!match) return null;
    const [, code, num] = match;
    const team = ALL_TEAMS.find((t) => t.code === code);
    if (!team || parseInt(num) < 1 || parseInt(num) > STICKERS_PER_TEAM) return null;
    return { code, number: parseInt(num), team };
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true); setPhotoResult(null);
    try {
      const base64 = await new Promise((res) => {
        const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.readAsDataURL(file);
      });
      const validCodes = ALL_TEAMS.map(t => t.code).join(', ');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
            { type: 'text', text: `Identifique figurinhas Panini 2026. Códigos: ${validCodes}. Retorne apenas JSON: {"stickers": ["BRA1", "ARG5"]}.` }
          ]}]
        }),
      });
      const data = await response.json();
      const parsed = JSON.parse(data.content?.[0]?.text.replace(/```json|```/g, '').trim() || '{"stickers":[]}');
      if (parsed.stickers?.length > 0) setPhotoResult(parsed.stickers);
      else showFeedback('Nenhuma figurinha encontrada', 'warning');
    } catch (err) { showFeedback('Erro na IA. Tente digitar os códigos.', 'error'); } finally { setPhotoLoading(false); }
  };

  // Estatísticas e Filtros
  const uniqueCount = Object.keys(collection).length;
  const totalCount = Object.values(collection).reduce((a, b) => a + b, 0);
  const repeats = Object.entries(collection).filter(([, count]) => count > 1);
  const repeatCount = repeats.reduce((acc, [, count]) => acc + (count - 1), 0);
  const progressPct = ((uniqueCount / TOTAL_STICKERS) * 100).toFixed(1);

  const filteredTeams = ALL_TEAMS.filter(t => (filter.group === 'all' || t.group === filter.group) && (filter.team === 'all' || t.code === filter.team));

  if (session === undefined) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#003a70', color: '#fff' }}>Carregando...</div>;
  if (!session) return <LoginScreen />;

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ flex: 1 }}>
            <div style={styles.eyebrow}>FIFA WORLD CUP 2026™ · Álbum Compartilhado</div>
            <select 
              value={albumId || ''} 
              onChange={(e) => { setAlbumId(e.target.value); fetchStickers(e.target.value); }}
              style={styles.albumSelect}
            >
              {userAlbums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={styles.statBlock}>
              <div style={styles.statBig}>{progressPct}%</div>
              <div style={styles.statSmall}>{uniqueCount} / {TOTAL_STICKERS}</div>
            </div>
            <button onClick={() => supabase.auth.signOut()} style={styles.logoutBtn}><LogOut size={18} /></button>
          </div>
        </div>
        <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${progressPct}%` }} /></div>
      </header>

      <nav style={styles.tabs}>
        {[
          { id: 'input', label: 'Adicionar', icon: Plus },
          { id: 'collection', label: 'Coleção', icon: Filter },
          { id: 'repeats', label: `Repetidas (${repeatCount})`, icon: ArrowLeftRight },
          { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
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
              <h2 style={styles.cardTitle}>Digitar figurinhas</h2>
              <p style={styles.cardHint}>Formato: <code style={styles.code}>BRA12</code>. Várias: <code style={styles.code}>BRA1 ARG5</code></p>
              <div style={styles.inputRow}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSticker(input)} placeholder="BRA12, ARG5..." style={styles.input} />
                <button onClick={() => { addSticker(input); setInput(''); }} style={styles.primaryBtn}>Adicionar</button>
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Importar por foto</h2>
              {!photoResult ? (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={photoLoading} style={{ ...styles.primaryBtn, ...styles.photoBtn }}>
                    {photoLoading ? <Loader2 size={18} className="spin" /> : <Camera size={18} />} Tirar foto
                  </button>
                </>
              ) : (
                <div style={styles.photoResultBox}>
                  <div style={styles.photoChipRow}>{photoResult.map((c, i) => <span key={i} style={styles.photoChip}>{c}</span>)}</div>
                  <div style={styles.photoActions}>
                    <button onClick={() => { addSticker(photoResult.join(' ')); setPhotoResult(null); }} style={styles.primaryBtn}>Confirmar Tudo</button>
                    <button onClick={() => setPhotoResult(null)} style={styles.secondaryBtn}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div style={styles.section}>
            <div style={styles.filterRow}>
              <select value={filter.group} onChange={e => setFilter({ group: e.target.value, team: 'all' })} style={styles.select}>
                <option value="all">Todos os grupos</option>
                {Object.keys(GROUPS).map(g => <option key={g} value={g}>Grupo {g}</option>)}
              </select>
              <select value={filter.team} onChange={e => setFilter({ ...filter, team: e.target.value })} style={styles.select}>
                <option value="all">Todas as seleções</option>
                {ALL_TEAMS.filter(t => filter.group === 'all' || t.group === filter.group).map(t => <option key={t.code} value={t.code}>{t.flag} {t.name}</option>)}
              </select>
            </div>
            {filteredTeams.map(team => (
              <div key={team.code} style={styles.teamCard}>
                <div style={styles.teamHeader}><span style={styles.teamFlag}>{team.flag}</span> <span style={styles.teamName}>{team.name}</span></div>
                <div style={styles.stickerGrid}>
                  {Array.from({ length: STICKERS_PER_TEAM }, (_, i) => {
                    const key = `${team.code}${i+1}`;
                    const count = collection[key] || 0;
                    return (
                      <button key={i} style={{ ...styles.stickerCell, ...(count > 0 ? styles.stickerOwned : {}), ...(count > 1 ? styles.stickerDuplicate : {}) }}
                        onClick={e => e.shiftKey ? removeOne(key) : addSticker(`${team.code}${i+1}`)} onContextMenu={e => { e.preventDefault(); removeOne(key); }}>
                        <span style={styles.stickerNum}>{i+1}</span>
                        {count > 1 && <span style={styles.stickerBadge}>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'repeats' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Suas Repetidas</h2>
              {repeats.length === 0 ? <p style={styles.empty}>Nenhuma repetida ainda.</p> : 
                repeats.map(([key, count]) => (
                  <div key={key} style={styles.repeatRow}>
                    <span style={styles.repeatCode}>{key}</span>
                    <div style={styles.stepper}>
                      <button onClick={() => removeOne(key)} style={styles.stepBtn}>−</button>
                      <span style={styles.stepCount}>{count}</span>
                      <button onClick={() => addSticker(key)} style={styles.stepBtn}>+</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div style={styles.section}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}><div style={styles.statLabel}>Coladas</div><div style={styles.statValue}>{uniqueCount}</div></div>
              <div style={styles.statCard}><div style={styles.statLabel}>Repetidas</div><div style={styles.statValue}>{repeatCount}</div></div>
              <div style={styles.statCard}><div style={styles.statLabel}>Faltam</div><div style={styles.statValue}>{TOTAL_STICKERS - uniqueCount}</div></div>
            </div>
          </div>
        )}

        {activeTab === 'invite' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Código deste Álbum[cite: 1]</h2>
              <div style={styles.codeBox}>
                <span style={styles.inviteCodeText}>{userAlbums.find(a => a.id === albumId)?.invite_code || '---'}</span>
                <button onClick={() => { navigator.clipboard.writeText(userAlbums.find(a => a.id === albumId)?.invite_code); showFeedback('Copiado!'); }} style={styles.iconBtn}><Copy size={16}/></button>
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Entrar em Álbum</h2>
              <div style={styles.inputRow}>
                <input type="text" id="joinCode" placeholder="Código único" style={styles.input} />
                <button onClick={() => handleJoinAlbum(document.getElementById('joinCode').value)} style={styles.primaryBtn}><Plus size={16}/> Entrar</button>
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Novo Álbum</h2>
              <div style={styles.inputRow}>
                <input type="text" id="albumName" placeholder="Nome do álbum" style={styles.input} />
                <button onClick={() => handleCreateAlbum(document.getElementById('albumName').value)} style={styles.primaryBtn}>Criar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const styles = {
  app: { fontFamily: "'DM Sans', sans-serif", background: '#f4f1ea', minHeight: '100vh', paddingBottom: '40px' },
  header: { background: 'linear-gradient(135deg, #003a70 0%, #0055a4 100%)', color: '#fff', padding: '24px 20px 0' },
  headerInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '16px' },
  eyebrow: { fontSize: '11px', letterSpacing: '2px', opacity: 0.8, marginBottom: '8px' },
  albumSelect: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', outline: 'none' },
  statBlock: { textAlign: 'right' },
  statBig: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#ffd400', lineHeight: 1 },
  statSmall: { fontSize: '12px', opacity: 0.8 },
  progressBar: { height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', maxWidth: '900px', margin: '0 auto' },
  progressFill: { height: '100%', background: '#ffd400', transition: 'width 0.3s ease' },
  tabs: { display: 'flex', gap: '4px', padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e5e1d8', maxWidth: '900px', margin: '0 auto', overflowX: 'auto' },
  tab: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', border: 'none', background: 'transparent', color: '#666', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', whiteSpace: 'nowrap' },
  tabActive: { background: '#003a70', color: '#fff' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e1d8' },
  cardTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', margin: '0 0 12px' },
  cardHint: { fontSize: '13px', color: '#666', marginBottom: '12px' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '12px', border: '2px solid #e5e1d8', borderRadius: '8px' },
  primaryBtn: { padding: '12px 20px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  secondaryBtn: { padding: '12px', border: '2px solid #e5e1d8', borderRadius: '8px', background: '#fff', cursor: 'pointer' },
  photoBtn: { width: '100%', justifyContent: 'center' },
  stickerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '6px', marginTop: '12px' },
  stickerCell: { aspectRatio: '1', border: '2px dashed #d4cdc0', borderRadius: '6px', background: 'none', fontWeight: 'bold', position: 'relative', cursor: 'pointer' },
  stickerOwned: { background: '#003a70', color: '#fff', borderStyle: 'solid' },
  stickerDuplicate: { background: '#d97706', borderStyle: 'solid' },
  stickerBadge: { position: 'absolute', top: '-5px', right: '-5px', background: '#1a1a1a', color: '#fff', fontSize: '10px', padding: '2px 5px', borderRadius: '8px' },
  feedback: { padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '15px', fontWeight: 500 },
  feedbackSuccess: { background: '#0a7a3f' },
  feedbackWarning: { background: '#d97706' },
  feedbackError: { background: '#c5331a' },
  codeBox: { display: 'flex', alignItems: 'center', gap: '15px', background: '#f4f1ea', padding: '15px', borderRadius: '8px' },
  inviteCodeText: { fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#003a70' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' },
  statCard: { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e1d8' },
  statLabel: { fontSize: '12px', color: '#888', textTransform: 'uppercase' },
  statValue: { fontSize: '32px', fontFamily: "'Bebas Neue', sans-serif", color: '#003a70' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '8px', color: '#fff', cursor: 'pointer' },
  iconBtn: { padding: '8px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: '#fff' },
  teamCard: { background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e1d8' },
  teamHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  teamName: { fontWeight: 'bold' },
  teamFlag: { fontSize: '24px' },
  repeatRow: { display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px' },
  stepper: { display: 'flex', alignItems: 'center', gap: '10px' },
  stepBtn: { width: '30px', height: '30px', borderRadius: '15px', border: '1px solid #ddd', cursor: 'pointer' }
};