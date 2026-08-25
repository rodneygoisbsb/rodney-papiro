import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Award,
  CheckCircle2,
  CalendarDays,
  ListOrdered,
  Sliders,
  BarChart3,
  User,
  Settings,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Check,
  Plus,
  Flame,
  Clock,
  Target,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  PenTool,
  X,
  Trophy,
  ExternalLink,
  AlertTriangle,
  Minimize2,
  Calendar,
  Layers,
  ArrowRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered as ListNum,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  Sparkles,
  Trash2,
  Edit2,
  Folder,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('concursos');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // -------------------------------------------------------------
  // ESTADO DOS CONCURSOS E DISCIPLINAS
  // -------------------------------------------------------------
  const [plans, setPlans] = useState([
    {
      id: '1',
      title: 'PM-DF Oficial',
      edital: 'Polícia Militar do Distrito Federal',
      role: 'Cadete Policial Militar',
      targetDate: '20/12/2026',
      badgeColor: 'bg-emerald-500',
      colorHex: '#10B981',
      questionsTotal: 420,
      accuracy: 84
    },
    {
      id: '2',
      title: 'Plano BB (Agente de Tecnologia)',
      edital: 'Banco do Brasil',
      role: 'Agente de Tecnologia (2026)',
      targetDate: '13/08/2026',
      badgeColor: 'bg-teal-500',
      colorHex: '#14B8A6',
      questionsTotal: 35,
      accuracy: 78
    }
  ]);
  const [selectedPlanId, setSelectedPlanId] = useState('1');

  // Disciplinas associadas por Plano
  const [disciplines, setDisciplines] = useState([
    {
      id: 'd1',
      planId: '1',
      name: 'Direito Constitucional',
      color: '#6366F1',
      studiedTopics: 8,
      totalTopics: 22,
      questionsDone: 140,
      topics: [
        { id: 't1_1', name: '1. Direitos e Garantias Fundamentais (Art. 5º)' },
        { id: 't1_2', name: '2. Direitos Sociais e Nacionalidade' },
        { id: 't1_3', name: '3. Organização Político-Administrativa do Estado' },
        { id: 't1_4', name: '4. Poder Executivo e Atribuições' },
        { id: 't1_5', name: '5. Segurança Pública (Art. 144)' }
      ]
    },
    {
      id: 'd2',
      planId: '1',
      name: 'Língua Portuguesa',
      color: '#EC4899',
      studiedTopics: 12,
      totalTopics: 18,
      questionsDone: 210,
      topics: [
        { id: 't2_1', name: '1. Compreensão e Interpretação de Textos' },
        { id: 't2_2', name: '2. Tipologia e Gêneros Textuais' },
        { id: 't2_3', name: '3. Ortografia Oficial e Acentuação Gráfica' },
        { id: 't2_4', name: '4. Emprego do Sinal Indicativo de Crase' },
        { id: 't2_5', name: '5. Sintaxe da Oração e do Período' }
      ]
    },
    {
      id: 'd3',
      planId: '1',
      name: 'Direito Administrativo',
      color: '#F59E0B',
      studiedTopics: 6,
      totalTopics: 20,
      questionsDone: 95,
      topics: [
        { id: 't3_1', name: '1. Princípios da Administração Pública' },
        { id: 't3_2', name: '2. Atos Administrativos (Atributos e Espécies)' },
        { id: 't3_3', name: '3. Poderes Administrativos' }
      ]
    },
    {
      id: 'd4',
      planId: '1',
      name: 'Raciocínio Lógico Matemático',
      color: '#EF4444',
      studiedTopics: 4,
      totalTopics: 14,
      questionsDone: 80,
      topics: [
        { id: 't4_1', name: '1. Proposições Simples e Compostas' },
        { id: 't4_2', name: '2. Equivalências Lógicas e Negações' }
      ]
    },
    {
      id: 'd5',
      planId: '2',
      name: 'Conhecimentos Bancários',
      color: '#3B82F6',
      studiedTopics: 0,
      totalTopics: 15,
      questionsDone: 0,
      topics: [
        { id: 't5_1', name: '1. Sistema Financeiro Nacional (CMN e BACEN)' },
        { id: 't5_2', name: '2. Mercado de Câmbio e Taxa Selic' }
      ]
    },
    {
      id: 'd6',
      planId: '2',
      name: 'Tecnologia da Informação',
      color: '#10B981',
      studiedTopics: 2,
      totalTopics: 25,
      questionsDone: 35,
      topics: [
        { id: 't6_1', name: '1. Bancos de Dados Relacionais e SQL' },
        { id: 't6_2', name: '2. Linguagens de Programação: Java e Python' }
      ]
    }
  ]);

  // Plano ativo & Cálculos de Progresso
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const currentDisciplines = disciplines.filter((d) => d.planId === currentPlan.id);

  const totalPlanTopics = currentDisciplines.reduce((acc, d) => acc + (d.topics?.length || 0), 0);
  const totalPlanStudied = currentDisciplines.reduce((acc, d) => acc + (d.studiedTopics || 0), 0);
  const progressPercentage = totalPlanTopics > 0 ? Math.round((totalPlanStudied / totalPlanTopics) * 100) : 0;
  const topicsRemaining = Math.max(0, totalPlanTopics - totalPlanStudied);

  // Modais de Edição de Disciplina
  const [activeDisciplineEditor, setActiveDisciplineEditor] = useState(null);
  const [newTopicInput, setNewTopicInput] = useState('');

  // Metas Diárias
  const [dailyGoals, setDailyGoals] = useState([
    {
      id: 'g1',
      topicId: 't1_1',
      subject: 'Direito Constitucional',
      subjectColor: '#6366F1',
      topicName: 'Direitos e Garantias Fundamentais (Art. 5º)',
      importance: 'Alta Incidência',
      type: 'THEORY',
      durationMinutes: 90,
      completed: false,
      studyMethod: 'PDF, Lei Seca',
      tecUrl: 'https://www.tecconcursos.com.br',
      videoUrl: 'https://www.grancursosonline.com.br',
      pdfUrl: '#',
      errorNotes: '<h3>Pegadinha:</h3><p>Inviolabilidade do domicílio: flagrante delito ou desastre permite entrar à noite.</p>',
      summaryNotes: '<h3>Art. 5º</h3><p>• Homens e mulheres iguais.<br>• Princípio da legalidade estrita.</p>'
    },
    {
      id: 'g2',
      topicId: 't2_4',
      subject: 'Língua Portuguesa',
      subjectColor: '#EC4899',
      topicName: 'Emprego do Sinal Indicativo de Crase',
      importance: 'Alta Incidência',
      type: 'REVISION',
      revisionTag: 'Revisão 7 dias',
      durationMinutes: 45,
      completed: false,
      studyMethod: 'Videoaula',
      tecUrl: 'https://www.tecconcursos.com.br',
      videoUrl: 'https://www.grancursosonline.com.br',
      pdfUrl: '#',
      errorNotes: '<p>Não usar crase antes de pronomes de tratamento.</p>',
      summaryNotes: '<p>Crase = A + A.</p>'
    }
  ]);

  const [editalTopics, setEditalTopics] = useState([
    { id: 't1', subject: 'LÍNGUA PORTUGUESA', name: 'Compreensão e Interpretação de Textos', theory: true, r1: true, r2: true, r3: false, r4: false, r5: false, r6: false, lastStudied: '24/08/2026', totalQuestions: 60, correctQuestions: 54 },
    { id: 't2', subject: 'LÍNGUA PORTUGUESA', name: 'Ortografia Oficial e Acentuação Gráfica', theory: true, r1: true, r2: false, r3: false, r4: false, r5: false, r6: false, lastStudied: '22/08/2026', totalQuestions: 40, correctQuestions: 35 },
    { id: 't3', subject: 'LÍNGUA PORTUGUESA', name: 'Emprego do Sinal Indicativo de Crase', theory: false, r1: false, r2: false, r3: false, r4: false, r5: false, r6: false, lastStudied: '-', totalQuestions: 0, correctQuestions: 0 },
    { id: 't4', subject: 'DIREITO CONSTITUCIONAL', name: 'Direitos e Deveres Individuais e Coletivos (Art. 5º)', theory: true, r1: true, r2: true, r3: true, r4: false, r5: false, r6: false, lastStudied: '25/08/2026', totalQuestions: 95, correctQuestions: 82 }
  ]);

  // Modais de Sessão e Editor Rico
  const [activeStudyModal, setActiveStudyModal] = useState(null);
  const [activeEditorModal, setActiveEditorModal] = useState(null);
  const [summaryHtml, setSummaryHtml] = useState('');
  const [errorHtml, setErrorHtml] = useState('');
  const editorRef = useRef(null);

  const [selectedMethods, setSelectedMethods] = useState([]);
  const [isManualTime, setIsManualTime] = useState(false);
  const [manualMinutes, setManualMinutes] = useState(60);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionsDone, setQuestionsDone] = useState(0);
  const [questionsRight, setQuestionsRight] = useState(0);
  const [revisions, setRevisions] = useState({ r24h: false, r7d: false, r15d: false, r30d: false, r60d: false, r90d: false });
  const [blockRevisionChecked, setBlockRevisionChecked] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isManualTime) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isManualTime]);

  useEffect(() => {
    if (activeEditorModal && editorRef.current) {
      editorRef.current.innerHTML = activeEditorModal.type === 'errors' ? errorHtml : summaryHtml;
      editorRef.current.focus();
    }
  }, [activeEditorModal]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // MANIPULAÇÃO DE DISCIPLINAS
  // -------------------------------------------------------------
  const handleDeletePlan = (planId) => {
    if (plans.length <= 1) {
      alert('Você precisa ter pelo menos um plano cadastrado.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este plano e todas as suas disciplinas?')) {
      const remainingPlans = plans.filter((p) => p.id !== planId);
      setPlans(remainingPlans);
      setDisciplines(disciplines.filter((d) => d.planId !== planId));
      setSelectedPlanId(remainingPlans[0].id);
    }
  };

  const handleAddNewDiscipline = () => {
    const newDisc = {
      id: 'd_' + Date.now(),
      planId: currentPlan.id,
      name: 'Nova Disciplina',
      color: '#6366F1',
      studiedTopics: 0,
      totalTopics: 0,
      questionsDone: 0,
      topics: []
    };
    setDisciplines([...disciplines, newDisc]);
    setActiveDisciplineEditor({ ...newDisc });
  };

  const handleSaveDisciplineEditor = () => {
    if (!activeDisciplineEditor) return;
    setDisciplines((prev) =>
      prev.map((d) =>
        d.id === activeDisciplineEditor.id
          ? {
              ...activeDisciplineEditor,
              totalTopics: activeDisciplineEditor.topics.length
            }
          : d
      )
    );
    setActiveDisciplineEditor(null);
  };

  const handleDeleteDiscipline = (discId) => {
    if (confirm('Deseja remover esta disciplina e seus tópicos?')) {
      setDisciplines((prev) => prev.filter((d) => d.id !== discId));
      setActiveDisciplineEditor(null);
    }
  };

  const handleAddTopicToDiscipline = () => {
    if (!newTopicInput.trim() || !activeDisciplineEditor) return;
    const newTopic = {
      id: 't_' + Date.now(),
      name: `${activeDisciplineEditor.topics.length + 1}. ${newTopicInput.trim()}`
    };
    setActiveDisciplineEditor({
      ...activeDisciplineEditor,
      topics: [...activeDisciplineEditor.topics, newTopic]
    });
    setNewTopicInput('');
  };

  const handleMoveTopic = (index, direction) => {
    if (!activeDisciplineEditor) return;
    const list = [...activeDisciplineEditor.topics];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setActiveDisciplineEditor({ ...activeDisciplineEditor, topics: list });
  };

  const handleDeleteTopicFromEditor = (topicId) => {
    if (!activeDisciplineEditor) return;
    setActiveDisciplineEditor({
      ...activeDisciplineEditor,
      topics: activeDisciplineEditor.topics.filter((t) => t.id !== topicId)
    });
  };

  // -------------------------------------------------------------
  // SESSÃO DE ESTUDO & EDIÇÃO DE TEXTO
  // -------------------------------------------------------------
  const handleOpenStudy = (goal) => {
    setActiveStudyModal(goal);
    setSummaryHtml(goal.summaryNotes || '');
    setErrorHtml(goal.errorNotes || '');
    setSelectedMethods(goal.studyMethod ? goal.studyMethod.split(', ') : []);
    setQuestionsDone(goal.questionsTotal || 0);
    setQuestionsRight(goal.questionsCorrect || 0);
    setManualMinutes(goal.durationMinutes || 60);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setIsManualTime(false);
    setIsFocusMode(false);
    setActiveEditorModal(null);
  };

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const saveEditorContent = () => {
    if (editorRef.current && activeEditorModal) {
      const content = editorRef.current.innerHTML;
      if (activeEditorModal.type === 'errors') setErrorHtml(content);
      else setSummaryHtml(content);
    }
    setActiveEditorModal(null);
  };

  const handleFinishStudy = async () => {
    if (!activeStudyModal) return;
    const calculatedMinutes = isManualTime ? Number(manualMinutes) : Math.max(1, Math.floor(timerSeconds / 60));
    const methodsString = selectedMethods.join(', ');

    const selectedIntervalDays = [];
    if (revisions.r24h) selectedIntervalDays.push(1);
    if (revisions.r7d) selectedIntervalDays.push(7);
    if (revisions.r15d) selectedIntervalDays.push(15);
    if (revisions.r30d) selectedIntervalDays.push(30);
    if (revisions.r60d) selectedIntervalDays.push(60);
    if (revisions.r90d) selectedIntervalDays.push(90);

    try {
      await api.post(`/topics/${activeStudyModal.topicId}/complete`, {
        selectedIntervalDays,
        scheduleBlockRevision: blockRevisionChecked,
        actualDurationMinutes: calculatedMinutes,
        questionsTotal: Number(questionsDone),
        questionsCorrect: Number(questionsRight),
        studyMethod: methodsString,
        errorNotebookNotes: errorHtml,
        summaryNotes: summaryHtml
      });
    } catch {
      console.log('Salvo localmente');
    }

    setDailyGoals((prev) =>
      prev.map((g) =>
        g.id === activeStudyModal.id
          ? {
              ...g,
              completed: true,
              durationMinutes: calculatedMinutes,
              questionsTotal: Number(questionsDone),
              questionsCorrect: Number(questionsRight),
              summaryNotes: summaryHtml,
              errorNotes: errorHtml,
              studyMethod: methodsString
            }
          : g
      )
    );

    setIsFocusMode(false);
    setActiveStudyModal(null);
    setIsTimerRunning(false);
  };

  const toggleEditalCheck = (topicId, field) => {
    setEditalTopics((prev) =>
      prev.map((item) => (item.id === topicId ? { ...item, [field]: !item[field] } : item))
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* APLICATIVO PRINCIPAL */}
      <div className="flex w-full h-full">
        
        {/* MENU LATERAL */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 select-none z-10 shrink-0`}>
          <div>
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shrink-0">
                  R
                </div>
                {!isSidebarCollapsed && (
                  <div className="leading-tight">
                    <h1 className="font-extrabold text-sm text-white whitespace-nowrap">RODNEY PAPIRO</h1>
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase whitespace-nowrap">Plataforma</p>
                  </div>
                )}
              </div>
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {[
                { id: 'inicio', label: 'Início', icon: LayoutDashboard },
                { id: 'concursos', label: 'Concursos', icon: Award },
                { id: 'metas', label: 'Metas diárias', icon: CheckCircle2 },
                { id: 'quadro', label: 'Quadro Semanal', icon: CalendarDays },
                { id: 'edital', label: 'Edital Verticalizado', icon: ListOrdered },
                { id: 'planejamento', label: 'Planejamento', icon: Sliders },
                { id: 'desempenho', label: 'Desempenho', icon: BarChart3 }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 border-t border-slate-800 space-y-1">
            <button className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60`}>
              <User size={18} />
              {!isSidebarCollapsed && <span>Perfil</span>}
            </button>
            <button className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60`}>
              <Settings size={18} />
              {!isSidebarCollapsed && <span>Configurações</span>}
            </button>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950 z-0">
          
          <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3 text-xs">
              <span className="uppercase font-bold text-slate-400">Plano Selecionado:</span>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="bg-slate-800 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Flame size={15} className="text-orange-400" />
                <span className="font-bold text-slate-200">12 dias de constância</span>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl w-full mx-auto space-y-8">

            {/* ========================================================= */}
            {/* ABA: CONCURSOS */}
            {/* ========================================================= */}
            {activeTab === 'concursos' && (
              <div className="space-y-8">
                
                {/* Cabeçalho Limpo (Sem o botão no canto direito) */}
                <div>
                  <h2 className="text-2xl font-black text-white">Planos de Concurso</h2>
                  <p className="text-xs text-slate-400">Selecione o edital para acompanhar o progresso e gerenciar suas disciplinas</p>
                </div>

                {/* Grid com o Card de Criar Novo Plano + Planos Existentes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Card Tracejado: Criar Novo Plano */}
                  <div
                    onClick={() => setIsCreatePlanModalOpen(true)}
                    className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 text-slate-500 group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                      <Plus size={24} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">Criar Novo Plano</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Adicionar novo concurso ao sistema</p>
                    </div>
                  </div>

                  {/* Cards de Planos Existentes */}
                  {plans.map((p) => {
                    const isSelected = p.id === currentPlan.id;
                    const planDiscs = disciplines.filter((d) => d.planId === p.id);
                    const totalTopics = planDiscs.reduce((acc, d) => acc + (d.topics?.length || 0), 0);

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`bg-slate-900 border rounded-2xl p-5 space-y-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow"
                            style={{ backgroundColor: p.colorHex || '#10B981' }}
                          >
                            {p.title.charAt(0)}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                            📅 Prova: {p.targetDate}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-white">{p.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {planDiscs.length} disciplinas cadastradas • {totalTopics} tópicos no edital
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAINEL DO CONCURSO ATIVO */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
                  
                  {/* Topo do Plano: Info + Progresso do Edital + Questões/Desempenho */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
                    
                    {/* Informações do Edital */}
                    <div className="flex items-start gap-5">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-slate-950 text-3xl shadow-lg shrink-0"
                        style={{ backgroundColor: currentPlan.colorHex || '#10B981' }}
                      >
                        {currentPlan.title.charAt(0)}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-white">{currentPlan.title}</h3>
                          <button
                            onClick={() => handleDeletePlan(currentPlan.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Excluir Plano"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <p className="text-xs text-slate-400"><span className="font-semibold text-slate-300">Órgão:</span> {currentPlan.edital}</p>
                        <p className="text-xs text-slate-400"><span className="font-semibold text-slate-300">Cargo:</span> {currentPlan.role}</p>

                        <div className="pt-2">
                          <button
                            onClick={handleAddNewDiscipline}
                            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                          >
                            <Plus size={15} /> Nova Disciplina
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progresso de Fechamento do Edital (Barra de Progresso) */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Progresso do Edital</span>
                          <span className="text-2xl font-black text-emerald-400">{progressPercentage}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {totalPlanStudied} de {totalPlanTopics} tópicos estudados ({topicsRemaining} restantes)
                        </p>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="w-full bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-700/50">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Estatísticas de Questões e Acerto */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-around text-center">
                      <div>
                        <span className="text-3xl font-black text-white block">{currentPlan.questionsTotal}</span>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Questões Feitas</span>
                      </div>
                      <div className="w-[1px] h-10 bg-slate-800" />
                      <div>
                        <span className="text-3xl font-black text-teal-400 block">{currentPlan.accuracy}%</span>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Desempenho</span>
                      </div>
                    </div>

                  </div>

                  {/* Grid de Disciplinas Clean com Ícones que Revelam Texto no Hover */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-lg text-white flex items-center gap-2">
                        <Layers size={20} className="text-emerald-400" /> Disciplinas ({currentDisciplines.length})
                      </h4>
                      <span className="text-xs text-slate-500">Passe o mouse nos ícones de cada card para ver as opções</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {currentDisciplines.map((d) => (
                        <div
                          key={d.id}
                          className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all group"
                        >
                          {/* Conteúdo do Card */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: d.color }} />
                              <h5 className="font-extrabold text-base text-white truncate">{d.name}</h5>
                            </div>

                            {/* Indicadores com Números Maiores */}
                            <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
                              <div>
                                <span className="block font-black text-2xl text-emerald-400 tracking-tight">{d.studiedTopics}</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5 block">Estudados</span>
                              </div>
                              <div>
                                <span className="block font-black text-2xl text-slate-100 tracking-tight">{d.topics?.length || 0}</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5 block">Totais</span>
                              </div>
                              <div>
                                <span className="block font-black text-2xl text-teal-400 tracking-tight">{d.questionsDone}</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5 block">Questões</span>
                              </div>
                            </div>
                          </div>

                          {/* Barra de Ações Clean: Apenas Ícones com Expansão Suave no Hover (Sem Linhas) */}
                          <div className="flex items-center justify-end gap-2 pt-4 mt-2">
                            {/* Visualizar -> Edital Verticalizado */}
                            <button
                              onClick={() => setActiveTab('edital')}
                              className="group/btn flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                              title="Edital Verticalizado"
                            >
                              <Folder size={16} className="shrink-0" />
                              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover/btn:max-w-[140px] group-hover/btn:opacity-100 text-[11px] font-bold transition-all duration-300 ease-out">
                                Edital Verticalizado
                              </span>
                            </button>

                            {/* Editar -> Editar Assuntos */}
                            <button
                              onClick={() => setActiveDisciplineEditor({ ...d })}
                              className="group/btn flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                              title="Editar Assuntos"
                            >
                              <Edit2 size={16} className="shrink-0" />
                              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover/btn:max-w-[120px] group-hover/btn:opacity-100 text-[11px] font-bold transition-all duration-300 ease-out">
                                Editar Assuntos
                              </span>
                            </button>

                            {/* Remover */}
                            <button
                              onClick={() => handleDeleteDiscipline(d.id)}
                              className="group/btn flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                              title="Remover"
                            >
                              <Trash2 size={16} className="shrink-0" />
                              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover/btn:max-w-[80px] group-hover/btn:opacity-100 text-[11px] font-bold transition-all duration-300 ease-out">
                                Remover
                              </span>
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ABA: INÍCIO */}
            {activeTab === 'inicio' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estudo Semanal</span>
                      <Clock size={18} className="text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">14h</span>
                      <span className="text-sm font-semibold text-slate-400">/ 25h meta</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '56%' }} />
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Desempenho Questões</span>
                      <Target size={18} className="text-teal-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">81.6%</span>
                      <span className="text-xs font-semibold text-slate-400">(98 de 120 acertos)</span>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1 font-medium"><TrendingUp size={14} /> +4.2% em relação à semana anterior</p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/50 border border-indigo-500/40 p-5 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5"><BookOpen size={16} /> Estudos de Hoje</span>
                      <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">Ao Vivo</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-4xl font-black text-white">90<span className="text-xl font-bold text-indigo-300 ml-1">min</span></p>
                        <span className="text-xs text-indigo-200/70 font-semibold">Líquido</span>
                      </div>
                      <div>
                        <p className="text-4xl font-black text-emerald-400">35</p>
                        <span className="text-xs text-indigo-200/70 font-semibold">Questões</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold text-lg text-white flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-400" /> Metas de Hoje (Teoria & Revisões)</h3>
                    <button onClick={() => setActiveTab('metas')} className="text-xs font-bold text-emerald-400 hover:underline">Ver todas as metas →</button>
                  </div>
                  
                  <div className="space-y-3">
                    {dailyGoals.map((goal) => (
                      <div key={goal.id} onClick={() => handleOpenStudy(goal)} className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${goal.completed ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-2.5 h-12 rounded-full shrink-0" style={{ backgroundColor: goal.subjectColor }} />
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-black uppercase text-slate-300">{goal.subject}</span>
                              {goal.type === 'REVISION' && <span className="bg-pink-500/20 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-md">{goal.revisionTag}</span>}
                              {goal.studyMethod && <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">{goal.studyMethod}</span>}
                            </div>
                            <h4 className={`font-bold text-base text-slate-100 ${goal.completed ? 'line-through text-slate-400' : ''}`}>{goal.topicName}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-400">{goal.durationMinutes} min</span>
                          {goal.completed ? (
                            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-500/30"><Check size={14} /> Feito</span>
                          ) : (
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-lg shadow-lg">Iniciar Estudo</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA: METAS DIÁRIAS */}
            {activeTab === 'metas' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Metas Diárias de Estudo</h2>
                  <p className="text-xs text-slate-400">Acesse cadernos de questões, vídeoaulas e registre suas sessões de estudo</p>
                </div>

                <div className="space-y-4">
                  {dailyGoals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleOpenStudy(goal)}
                      className={`bg-slate-900 border rounded-2xl p-6 space-y-4 cursor-pointer transition-all ${
                        goal.completed ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-red-500/20 text-red-300 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/30 uppercase">
                              ! {goal.importance}
                            </span>
                            <span className="text-xs font-bold text-slate-300 uppercase">{goal.subject}</span>
                            {goal.studyMethod && (
                              <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                                {goal.studyMethod}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-white">{goal.topicName}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-400">{goal.durationMinutes} min</span>
                          {goal.completed ? (
                            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 border border-emerald-500/30">
                              <Check size={16} /> Meta Concluída (Clique para Editar)
                            </span>
                          ) : (
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                              <Play size={15} fill="currentColor" /> Iniciar Sessão de Estudo
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                        <span className="text-slate-400">Material de Apoio:</span>
                        {goal.tecUrl && (
                          <a
                            href={goal.tecUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-teal-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
                          >
                            <ExternalLink size={13} /> Caderno TEC Concursos
                          </a>
                        )}
                        {goal.videoUrl && (
                          <a
                            href={goal.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
                          >
                            <BookOpen size={13} /> Videoaula Gran / Estratégia
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA: QUADRO SEMANAL */}
            {activeTab === 'quadro' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Quadro Semanal de Metas</h2>
                  <p className="text-xs text-slate-400">Distribuição visual das metas de teoria, revisão e simulados em cada dia da semana</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, idx) => (
                    <div key={day} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[260px] flex flex-col justify-between space-y-4">
                      <div>
                        <div className="border-b border-slate-800 pb-2 mb-3">
                          <span className="text-xs font-black uppercase text-slate-300">{day}</span>
                        </div>
                        {idx === 0 && (
                          <div className="p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/20 space-y-1">
                            <span className="text-[10px] font-bold text-indigo-300 uppercase">Dir. Constitucional</span>
                            <p className="text-xs font-semibold text-white">Art. 5º (Incisos I a XX)</p>
                            <span className="text-[10px] text-slate-400 block font-mono">90 min • Teoria</span>
                          </div>
                        )}
                      </div>
                      <button className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-emerald-400 py-2 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl transition-colors">
                        + Incluir Meta
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA: EDITAL VERTICALIZADO */}
            {activeTab === 'edital' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Edital Verticalizado & Revisões Espaçadas</h2>
                  <p className="text-xs text-slate-400">Controle de fechamento de teoria e 6 ciclos de revisões ($R_1$ a $R_6$)</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                      <tr>
                        <th className="p-4 font-black">DISCIPLINA & TÓPICO DO EDITAL</th>
                        <th className="p-4 text-center font-bold">TEORIA</th>
                        <th className="p-4 text-center font-bold">R1 (24h)</th>
                        <th className="p-4 text-center font-bold">R2 (7d)</th>
                        <th className="p-4 text-center font-bold">R3 (15d)</th>
                        <th className="p-4 text-center font-bold">R4 (30d)</th>
                        <th className="p-4 text-center font-bold">R5 (60d)</th>
                        <th className="p-4 text-center font-bold">R6 (90d)</th>
                        <th className="p-4 text-center font-bold">ÚLTIMO ESTUDO</th>
                        <th className="p-4 text-center font-bold">DESEMPENHO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {editalTopics.map((topic) => (
                        <tr key={topic.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-semibold text-slate-200">
                            <span className="text-[10px] uppercase block font-bold text-emerald-400">{topic.subject}</span>
                            {topic.name}
                          </td>
                          {['theory', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6'].map((col) => (
                            <td key={col} className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={topic[col]}
                                onChange={() => toggleEditalCheck(topic.id, col)}
                                className="checkbox checkbox-xs checkbox-emerald border-slate-600 cursor-pointer"
                              />
                            </td>
                          ))}
                          <td className="p-4 text-center text-slate-400 font-mono text-[11px]">
                            {topic.lastStudied}
                          </td>
                          <td className="p-4 text-center font-bold">
                            {topic.totalQuestions > 0 ? (
                              <span className="text-emerald-400 font-mono">
                                {Math.round((topic.correctQuestions / topic.totalQuestions) * 100)}% ({topic.correctQuestions}/{topic.totalQuestions})
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ABA: PLANEJAMENTO */}
            {activeTab === 'planejamento' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-black text-white text-center">Planejamento de Estudos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 text-left space-y-2">
                    <Calendar size={24} className="text-emerald-400" />
                    <h4 className="font-extrabold text-white text-sm">Cronograma Semanal</h4>
                    <p className="text-[11px] text-slate-400">Metas fixas distribuídas por dias da semana.</p>
                  </button>
                  <button className="p-5 rounded-xl border border-slate-700 bg-slate-800 text-left space-y-2 hover:border-slate-500">
                    <RotateCcw size={24} className="text-teal-400" />
                    <h4 className="font-extrabold text-white text-sm">Ciclo de Estudos</h4>
                    <p className="text-[11px] text-slate-400">Sequência fluida de matérias por horas estudadas.</p>
                  </button>
                </div>
              </div>
            )}

            {/* ABA: DESEMPENHO */}
            {activeTab === 'desempenho' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-white">Painel de Desempenho</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                    <h3 className="font-bold text-sm text-slate-300">Taxa de Acerto por Disciplina</h3>
                    {[
                      { name: 'Direito Constitucional', pct: 86, color: 'bg-indigo-500' },
                      { name: 'Direito Administrativo', pct: 88, color: 'bg-amber-500' },
                      { name: 'Língua Portuguesa', pct: 72, color: 'bg-pink-500' },
                      { name: 'Raciocínio Lógico (RLM)', pct: 58, color: 'bg-red-500' }
                    ].map((subj) => (
                      <div key={subj.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{subj.name}</span>
                          <span className="font-mono">{subj.pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${subj.color}`} style={{ width: `${subj.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: GERENCIADOR DE TÓPICOS DA DISCIPLINA */}
      {/* ========================================================= */}
      {activeDisciplineEditor && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#18181b] border border-zinc-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#13141a]">
              <h3 className="text-xl font-black text-white">{activeDisciplineEditor.name}</h3>
              <button onClick={() => setActiveDisciplineEditor(null)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-bold block mb-1.5 uppercase">Nome da Disciplina</label>
                  <input
                    type="text"
                    value={activeDisciplineEditor.name}
                    onChange={(e) => setActiveDisciplineEditor({ ...activeDisciplineEditor, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1.5 uppercase">Cor</label>
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2">
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: activeDisciplineEditor.color }} />
                    <select
                      value={activeDisciplineEditor.color}
                      onChange={(e) => setActiveDisciplineEditor({ ...activeDisciplineEditor, color: e.target.value })}
                      className="bg-transparent text-white font-bold outline-none w-full cursor-pointer"
                    >
                      <option value="#6366F1">Azul Índigo</option>
                      <option value="#EC4899">Rosa</option>
                      <option value="#F59E0B">Âmbar / Laranja</option>
                      <option value="#EF4444">Vermelho</option>
                      <option value="#10B981">Verde Esmeralda</option>
                      <option value="#8B5CF6">Roxo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-zinc-300 uppercase tracking-wider">Tópicos do Edital</span>
                  <span className="text-zinc-500 font-semibold">{activeDisciplineEditor.topics.length} tópicos cadastrados</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o nome do novo tópico/assunto..."
                    value={newTopicInput}
                    onChange={(e) => setNewTopicInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddTopicToDiscipline(); }}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopicToDiscipline}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus size={15} /> Adicionar
                  </button>
                </div>

                <div className="border border-zinc-800 bg-zinc-950/80 rounded-2xl divide-y divide-zinc-800/80 max-h-64 overflow-y-auto">
                  {activeDisciplineEditor.topics.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500">Nenhum tópico adicionado ainda.</div>
                  ) : (
                    activeDisciplineEditor.topics.map((t, idx) => (
                      <div key={t.id} className="p-3 flex items-center justify-between hover:bg-zinc-900/60 transition-colors">
                        <span className="font-semibold text-zinc-200 truncate pr-4">{t.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveTopic(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                            title="Subir"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveTopic(idx, 1)}
                            disabled={idx === activeDisciplineEditor.topics.length - 1}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                            title="Descer"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTopicFromEditor(t.id)}
                            className="p-1 text-zinc-400 hover:text-rose-400 ml-1"
                            title="Excluir Tópico"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-between items-center bg-[#13141a]">
              <button
                onClick={() => handleDeleteDiscipline(activeDisciplineEditor.id)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
              >
                Remover Disciplina
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveDisciplineEditor(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDisciplineEditor}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SESSÃO DE ESTUDO & CRONÔMETRO */}
      {activeStudyModal && !isFocusMode && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in-95">
            <button onClick={() => setActiveStudyModal(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="p-8 pb-6 border-b border-zinc-800 shrink-0">
              <p className="text-emerald-500 font-bold text-xs uppercase tracking-wider">{activeStudyModal.subject}</p>
              <h2 className="text-white font-black text-2xl mt-1 pr-8">{activeStudyModal.topicName}</h2>

              <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
                    <Clock size={20} className="text-zinc-500" />
                    <span className="font-mono text-xl font-bold tracking-wider">{formatTimer(timerSeconds)}</span>
                  </div>
                  
                  {!isManualTime && (
                    <>
                      <button
                        onClick={() => { setIsTimerRunning(true); setIsFocusMode(true); }}
                        className="h-10 px-4 flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow"
                      >
                        <Play size={16} fill="currentColor" /> Modo Concentração
                      </button>
                      <button
                        onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors shadow"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </>
                  )}
                  
                  <button onClick={() => setIsManualTime(!isManualTime)} className="text-xs font-bold text-zinc-500 hover:text-emerald-400 underline ml-2 transition-colors">
                    {isManualTime ? 'Voltar para Cronômetro' : 'Inserir Tempo Manual'}
                  </button>
                </div>
                
                <button onClick={handleFinishStudy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20">
                  <Trophy size={18} /> Finalizar missão
                </button>
              </div>

              {isManualTime && (
                <div className="mt-4 flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg w-fit border border-zinc-700">
                  <span className="text-xs font-bold text-zinc-300">Minutos estudados:</span>
                  <input
                    type="number"
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-md w-20 px-3 py-1.5 text-emerald-400 font-mono font-bold text-base outline-none focus:border-emerald-500 text-center"
                  />
                  <span className="text-xs font-medium text-zinc-400">min</span>
                </div>
              )}
            </div>

            <div className="p-8 overflow-y-auto space-y-6 bg-[#13141a] rounded-b-2xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Anotações & Cadernos de Estudo</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveEditorModal({ type: 'errors', title: 'Caderno de Erros' })}
                    className="bg-[#1c1d24] border border-zinc-800 hover:border-rose-500/50 p-5 rounded-2xl flex items-center justify-between group transition-all text-left shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                        <FileText size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white">Caderno de Erros</h4>
                          {errorHtml && <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">Preenchido</span>}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Pegadinhas e questões erradas</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">Editar →</span>
                  </button>

                  <button
                    onClick={() => setActiveEditorModal({ type: 'summary', title: 'Resumo da Matéria' })}
                    className="bg-[#1c1d24] border border-zinc-800 hover:border-emerald-500/50 p-5 rounded-2xl flex items-center justify-between group transition-all text-left shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <PenTool size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white">Resumo da Matéria</h4>
                          {summaryHtml && <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Preenchido</span>}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Pontos-chave e mnemônicos</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">Editar →</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Métodos Utilizados</span>
                  <div className="flex flex-wrap gap-2">
                    {['PDF', 'Videoaula', 'Questões', 'Lei Seca', 'Resumo Próprio'].map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setSelectedMethods((prev) =>
                            prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
                          );
                        }}
                        className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
                          selectedMethods.includes(method) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Desempenho em Questões</span>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Qtd. Feitas</label>
                      <input
                        type="number"
                        value={questionsDone}
                        onChange={(e) => setQuestionsDone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Qtd. Acertos</label>
                      <input
                        type="number"
                        value={questionsRight}
                        onChange={(e) => setQuestionsRight(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50">
                  <span className="text-xs font-bold text-zinc-400 block tracking-wider">AGENDAMENTO DE REVISÕES PERIÓDICAS</span>
                  <div className="flex flex-wrap gap-3">
                    {[{ key: 'r24h', label: '24 horas' }, { key: 'r7d', label: '7 dias' }, { key: 'r15d', label: '15 dias' }, { key: 'r30d', label: '30 dias' }, { key: 'r60d', label: '60 dias' }, { key: 'r90d', label: '90 dias' }].map((rev) => (
                      <label key={rev.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${revisions[rev.key] ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                        <input type="checkbox" checked={revisions[rev.key]} onChange={(e) => setRevisions({ ...revisions, [rev.key]: e.target.checked })} className="hidden" />
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${revisions[rev.key] ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                          {revisions[rev.key] && <Check size={10} className="text-zinc-950 stroke-[4]" />}
                        </div>
                        <span className={`text-xs font-bold ${revisions[rev.key] ? 'text-emerald-400' : 'text-zinc-500'}`}>{rev.label}</span>
                      </label>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-4 border-t border-zinc-800/80">
                    <input type="checkbox" checked={blockRevisionChecked} onChange={(e) => setBlockRevisionChecked(e.target.checked)} className="hidden" />
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${blockRevisionChecked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                      {blockRevisionChecked && <Check size={12} className="text-zinc-950 stroke-[4]" />}
                    </div>
                    <span className="text-xs font-semibold text-emerald-500">Contabilizar para Revisão em Bloco (Dispara a cada 3 tópicos desta disciplina)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITOR DE TEXTO RICO */}
      {activeEditorModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#18181b] border border-zinc-700 rounded-3xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-[#13141a]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeEditorModal.type === 'errors' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {activeEditorModal.type === 'errors' ? <FileText size={20} /> : <PenTool size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">{activeEditorModal.title}</h3>
                  <p className="text-[11px] text-zinc-400">{activeStudyModal?.subject} • {activeStudyModal?.topicName}</p>
                </div>
              </div>
              <button onClick={() => setActiveEditorModal(null)} className="text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-2.5 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center gap-1 text-xs select-none">
              <button onClick={() => execCmd('bold')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><Bold size={15} /></button>
              <button onClick={() => execCmd('italic')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><Italic size={15} /></button>
              <button onClick={() => execCmd('underline')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><Underline size={15} /></button>
              <button onClick={() => execCmd('strikeThrough')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><Strikethrough size={15} /></button>
              <div className="w-[1px] h-5 bg-zinc-700 mx-1" />
              <button onClick={() => execCmd('formatBlock', '<h1>')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><Heading1 size={15} /></button>
              <button onClick={() => execCmd('formatBlock', '<h2>')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><Heading2 size={15} /></button>
              <div className="w-[1px] h-5 bg-zinc-700 mx-1" />
              <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><List size={15} /></button>
              <button onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><ListNum size={15} /></button>
              <div className="w-[1px] h-5 bg-zinc-700 mx-1" />
              <button onClick={() => execCmd('justifyLeft')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><AlignLeft size={15} /></button>
              <button onClick={() => execCmd('justifyCenter')} className="p-2 hover:bg-zinc-800 text-zinc-300 rounded-lg"><AlignCenter size={15} /></button>
            </div>

            <div
              ref={editorRef}
              contentEditable
              className="flex-1 p-8 overflow-y-auto bg-[#0f1015] text-slate-100 outline-none leading-relaxed prose prose-invert max-w-none text-sm font-sans"
              style={{ minHeight: '300px' }}
            />

            <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center bg-[#13141a]">
              <span className="text-xs text-zinc-500">As formatações ficam salvas no seu caderno de estudos.</span>
              <div className="flex gap-3">
                <button onClick={() => setActiveEditorModal(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white">Cancelar</button>
                <button onClick={saveEditorContent} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-7 py-2.5 rounded-xl shadow-lg">Salvar e Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODO DE CONCENTRAÇÃO */}
      {activeStudyModal && isFocusMode && (
        <div className="absolute inset-0 z-50 bg-[#090a0f] flex flex-col justify-between p-12 animate-in fade-in">
          <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
            <div>
              <span className="text-xs font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">MODO CONCENTRAÇÃO</span>
              <h1 className="text-xl md:text-2xl font-black text-white mt-2">{activeStudyModal.topicName}</h1>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{activeStudyModal.subject}</p>
            </div>
            <button onClick={() => setIsFocusMode(false)} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-800 transition-colors">
              <Minimize2 size={16} /> Voltar ao Painel
            </button>
          </div>

          <div className="flex flex-col items-center justify-center my-auto">
            <span className="font-mono text-7xl md:text-9xl font-black text-emerald-400 tracking-wider drop-shadow-[0_0_45px_rgba(16,185,129,0.3)]">
              {formatTimer(timerSeconds)}
            </span>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mt-4">Tempo Líquido em Foco</p>

            <div className="flex items-center gap-4 mt-8">
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${isTimerRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}>
                {isTimerRunning ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
              </button>
              <button onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }} className="w-16 h-16 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 flex items-center justify-center">
                <RotateCcw size={22} />
              </button>
            </div>
          </div>

          <div className="max-w-5xl w-full mx-auto flex justify-between items-center pt-6 border-t border-zinc-900">
            <span className="text-xs text-zinc-600 font-medium">Foco total no papiro. Sem distrações.</span>
            <button onClick={handleFinishStudy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
              <Trophy size={18} /> Finalizar Missão
            </button>
          </div>
        </div>
      )}

    </div>
  );
}