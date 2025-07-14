import React, { useState } from 'react';
import { FaBoxes, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaDownload, FaEye } from 'react-icons/fa';
import Navigation from '../components/Navigation';

// Página de Estoque com layout responsivo
function EstoquePage() {
  // Estados para filtros e dados
  const [pesquisa, setPesquisa] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [exportando, setExportando] = useState(false);

  // Novos estados para cadastro/ajuste
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false); // Novo estado para controlar se é edição
  const [formProduto, setFormProduto] = useState({
    nome: '',
    categoria: '',
    fornecedor: '',
    quantidade: '',
    foto: null,
    valorCompra: '',
    valorVenda: '',
    margem: '',
  });
  const [fotoPreview, setFotoPreview] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Novo estado para controle da câmera
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Dados mockados de produtos (agora com estado para permitir edição)
  const [produtosMock, setProdutosMock] = useState([
    { id: 1, nome: 'Arroz Integral', categoria: 'Alimentos', preco: 8.50, estoque: 15, estoqueMinimo: 10, fornecedor: 'Fornecedor A', codigo: 'ARR001', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iIzRDQUY1MCIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFycm96PC90ZXh0Pgo8L3N2Zz4K' },
    { id: 2, nome: 'Feijão Preto', categoria: 'Alimentos', preco: 6.80, estoque: 8, estoqueMinimo: 10, fornecedor: 'Fornecedor B', codigo: 'FEJ002', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iIzhENkU2MyIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZlaWphbzwvdGV4dD4KPC9zdmc+Cg==' },
    { id: 3, nome: 'Óleo de Soja', categoria: 'Alimentos', preco: 12.90, estoque: 22, estoqueMinimo: 15, fornecedor: 'Fornecedor A', codigo: 'OLE003', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iI0ZGQzEwNyIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPsO2bGVvPC90ZXh0Pgo8L3N2Zz4K' },
    { id: 4, nome: 'Sabão em Pó', categoria: 'Limpeza', preco: 15.70, estoque: 5, estoqueMinimo: 8, fornecedor: 'Fornecedor C', codigo: 'SAB004', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iIzIxOTZGMiIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhYsOjbzwvdGV4dD4KPC9zdmc+Cg==' },
    { id: 5, nome: 'Detergente', categoria: 'Limpeza', preco: 4.50, estoque: 18, estoqueMinimo: 12, fornecedor: 'Fornecedor D', codigo: 'DET005', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iIzAwQkNENCIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRldGVyZ2VudGU8L3RleHQ+Cjwvc3ZnPgo=' },
    { id: 6, nome: 'Papel Higiênico', categoria: 'Higiene', preco: 8.90, estoque: 25, estoqueMinimo: 20, fornecedor: 'Fornecedor E', codigo: 'PAP006', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iIzlFOUU5RSIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBhcGVsPC90ZXh0Pgo8L3N2Zz4K' },
    { id: 7, nome: 'Café em Pó', categoria: 'Alimentos', preco: 18.50, estoque: 12, estoqueMinimo: 15, fornecedor: 'Fornecedor A', codigo: 'CAF007', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iIzc5NTU0OCIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhZsOpPC90ZXh0Pgo8L3N2Zz4K' },
    { id: 8, nome: 'Açúcar Refinado', categoria: 'Alimentos', preco: 5.20, estoque: 30, estoqueMinimo: 25, fornecedor: 'Fornecedor B', codigo: 'ACU008', foto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNiIgZmlsbD0iI0ZGRUIzQiIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiPkHDs2FjYXI8L3RleHQ+Cjwvc3ZnPgo=' },
  ]);

  // Categorias mockadas
  const categoriasMock = [
    { value: 'todas', label: 'Todas as Categorias' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'limpeza', label: 'Limpeza' },
    { value: 'higiene', label: 'Higiene' },
  ];

  // Calcular KPIs
  const calcularKPIs = () => {
    const totalProdutos = produtosMock.length;
    const estoqueBaixo = produtosMock.filter(p => p.estoque < p.estoqueMinimo).length;
    const valorTotal = produtosMock.reduce((sum, p) => sum + (p.preco * p.estoque), 0);
    const produtosCriticos = produtosMock.filter(p => p.estoque <= p.estoqueMinimo * 0.5).length;

    return {
      totalProdutos,
      estoqueBaixo,
      valorTotal,
      produtosCriticos
    };
  };

  const kpis = calcularKPIs();

  // Filtrar produtos
  const produtosFiltrados = produtosMock.filter(produto => {
    const matchPesquisa = produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                         produto.codigo.toLowerCase().includes(pesquisa.toLowerCase());
    const matchCategoria = filtroCategoria === 'todas' || produto.categoria.toLowerCase() === filtroCategoria;
    const matchStatus = filtroStatus === 'todos' || 
                       (filtroStatus === 'baixo' && produto.estoque < produto.estoqueMinimo) ||
                       (filtroStatus === 'normal' && produto.estoque >= produto.estoqueMinimo);

    return matchPesquisa && matchCategoria && matchStatus;
  });

  // Função para exportar relatório
  const handleExportar = async () => {
    setExportando(true);
    try {
      // Simulação de exportação (mock - futuramente integração com backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Relatório de estoque exportado com sucesso! (mock)');
    } catch (error) {
      alert('Erro ao exportar relatório.');
    } finally {
      setExportando(false);
    }
  };

  // Função para ajustar estoque
  const handleAjustarEstoque = (produto) => {
    setProdutoSelecionado(produto);
    setMostrarModal(true);
  };

  // Função para abrir modal de cadastro
  const abrirCadastroProduto = () => {
    setModoEdicao(false); // Modo cadastro
    setFormProduto({ nome: '', categoria: '', fornecedor: '', quantidade: '', foto: null, valorCompra: '', valorVenda: '', margem: '' });
    setFotoPreview(null);
    setModalCadastro(true);
    setFeedback('');
  };

  // Nova função para abrir modal de edição
  const abrirEdicaoProduto = (produto) => {
    setModoEdicao(true); // Modo edição
    setProdutoSelecionado(produto); // Armazena produto para edição
    setFormProduto({
      nome: produto.nome,
      categoria: produto.categoria,
      fornecedor: produto.fornecedor,
      quantidade: produto.estoque.toString(),
      foto: produto.foto, // Carrega foto existente
      valorCompra: (produto.preco * 0.7).toFixed(2), // Simula valor de compra
      valorVenda: produto.preco.toFixed(2),
      margem: '30', // Simula margem padrão
    });
    setFotoPreview(produto.foto); // Mostra foto existente
    setModalCadastro(true);
    setFeedback('');
  };

  // Função para lidar com upload de foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name); // Debug
      const fotoUrl = URL.createObjectURL(file);
      setFormProduto(prev => ({ ...prev, foto: file }));
      setFotoPreview(fotoUrl);
    }
  };

  // Função para abrir a câmera
  const abrirCamera = () => {
    setShowCamera(true);
    setFotoPreview(null);
    setFormProduto(prev => ({ ...prev, foto: null }));
  };

  // Função para capturar foto da câmera
  const capturarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Configurar canvas com tamanho do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Desenhar frame do vídeo no canvas
      context.drawImage(video, 0, 0);
      
      // Converter para blob e criar URL
      canvas.toBlob((blob) => {
        if (blob) {
          const fotoUrl = URL.createObjectURL(blob);
          console.log('Foto capturada:', fotoUrl); // Debug
          setFormProduto(prev => ({ ...prev, foto: blob }));
          setFotoPreview(fotoUrl);
          setShowCamera(false);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Iniciar câmera ao abrir modal
  React.useEffect(() => {
    let stream;
    if (showCamera && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          videoRef.current.srcObject = s;
          videoRef.current.play();
        })
        .catch(err => {
          console.error('Erro ao acessar câmera:', err);
          alert('Erro ao acessar a câmera. Tente novamente ou use a opção de arquivo.');
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [showCamera]);

  // Limpar URLs quando componente for desmontado
  React.useEffect(() => {
    return () => {
      if (fotoPreview && fotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  // Função para calcular valor de venda a partir da margem
  const calcularValorVenda = (valorCompra, margem) => {
    if (!valorCompra || !margem) return '';
    return (parseFloat(valorCompra) * (1 + parseFloat(margem) / 100)).toFixed(2);
  };

  // Função para calcular margem a partir do valor de venda
  const calcularMargem = (valorCompra, valorVenda) => {
    if (!valorCompra || !valorVenda) return '';
    return (((parseFloat(valorVenda) / parseFloat(valorCompra)) - 1) * 100).toFixed(2);
  };

  // Função para gerar foto SVG para produtos
  const gerarFotoProduto = (nome, cor = '#4CAF50') => {
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="6" fill="${cor}"/>
        <text x="20" y="25" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${nome.substring(0, 6)}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Função para atualizar campos relacionados
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let novoForm = { ...formProduto, [name]: value };
    if (name === 'valorCompra' && formProduto.margem) {
      novoForm.valorVenda = calcularValorVenda(value, formProduto.margem);
    }
    if (name === 'margem' && formProduto.valorCompra) {
      novoForm.valorVenda = calcularValorVenda(formProduto.valorCompra, value);
    }
    if (name === 'valorVenda' && formProduto.valorCompra) {
      novoForm.margem = calcularMargem(formProduto.valorCompra, value);
    }
    setFormProduto(novoForm);
  };

  // Função para cadastrar/editar produto (mock)
  const handleCadastrarProduto = (e) => {
    e.preventDefault();
    if (!formProduto.nome || !formProduto.categoria || !formProduto.fornecedor || !formProduto.quantidade || !formProduto.valorCompra || !formProduto.valorVenda) {
      setFeedback('Preencha todos os campos obrigatórios!');
      return;
    }

    if (modoEdicao) {
      // Lógica de edição - atualizar produto existente
      setProdutosMock(prev => prev.map(produto => {
        if (produto.id === produtoSelecionado?.id) {
          // Se há uma nova foto, criar URL para ela
          let novaFoto = produto.foto; // Mantém foto atual por padrão
          if (formProduto.foto && formProduto.foto !== produto.foto) {
            // Se é um blob (foto capturada), criar URL
            if (formProduto.foto instanceof Blob) {
              novaFoto = URL.createObjectURL(formProduto.foto);
            } else if (typeof formProduto.foto === 'string') {
              novaFoto = formProduto.foto;
            }
          }
          
          return {
            ...produto,
            nome: formProduto.nome,
            categoria: formProduto.categoria,
            fornecedor: formProduto.fornecedor,
            estoque: parseInt(formProduto.quantidade),
            preco: parseFloat(formProduto.valorVenda),
            foto: novaFoto, // Usa a nova foto processada
          };
        }
        return produto;
      }));
      setFeedback('Produto atualizado com sucesso!');
    } else {
      // Lógica de cadastro - adicionar novo produto
      const cores = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B'];
      const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
      
      // Processar foto para novo produto
      let fotoProduto = gerarFotoProduto(formProduto.nome, corAleatoria); // Fallback padrão
      if (formProduto.foto) {
        if (formProduto.foto instanceof Blob) {
          fotoProduto = URL.createObjectURL(formProduto.foto);
        } else if (typeof formProduto.foto === 'string') {
          fotoProduto = formProduto.foto;
        }
      }
      
      const novoProduto = {
        id: Date.now(), // ID único simples
        nome: formProduto.nome,
        categoria: formProduto.categoria,
        fornecedor: formProduto.fornecedor,
        estoque: parseInt(formProduto.quantidade),
        estoqueMinimo: Math.ceil(parseInt(formProduto.quantidade) * 0.3), // 30% do estoque como mínimo
        preco: parseFloat(formProduto.valorVenda),
        codigo: `PROD${Date.now().toString().slice(-3)}`, // Código único simples
        foto: fotoProduto, // Usa a foto processada
      };
      setProdutosMock(prev => [...prev, novoProduto]);
      setFeedback('Produto cadastrado e conta a pagar gerada no financeiro!');
    }

    setTimeout(() => {
      setModalCadastro(false);
      setFeedback('');
      setModoEdicao(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      <div className="page-center" style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        maxWidth: '100vw'
      }}>
        <div className="card" style={{ 
          background: '#fff', 
          color: '#4B0082', 
          boxShadow: '0 4px 24px rgba(75,0,130,0.10)', 
          maxWidth: '100%',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Header da página */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 24, 
            paddingBottom: 16, 
            borderBottom: '1px solid #F3F0FA',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaBoxes size={28} color="#7B3FBF" />
              <h1 style={{ color: '#4B0082', fontSize: 24, fontWeight: 600, margin: 0 }}>Estoque</h1>
            </div>
            
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {/* Botão de filtros */}
              <button 
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                style={{ 
                  background: '#F3F0FA', 
                  color: '#7B3FBF', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                <FaFilter size={14} />
                Filtros
              </button>
              
              {/* Botão exportar */}
              <button 
                onClick={handleExportar}
                disabled={exportando}
                style={{ 
                  background: '#4B0082', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  cursor: exportando ? 'not-allowed' : 'pointer', 
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: exportando ? 0.7 : 1
                }}
              >
                <FaDownload size={14} />
                {exportando ? 'Exportando...' : 'Exportar'}
              </button>

              {/* Botão para abrir modal de cadastro */}
              <button
                onClick={abrirCadastroProduto}
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <FaPlus size={14} />
                Novo Produto
              </button>
            </div>
          </div>

          {/* Filtros */}
          {mostrarFiltros && (
            <div style={{ 
              background: '#F3F0FA', 
              borderRadius: 12, 
              padding: 20, 
              marginBottom: 24,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              alignItems: 'center'
            }}>
              {/* Pesquisa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200, flex: 1 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Pesquisar:</label>
                <div style={{ position: 'relative' }}>
                  <FaSearch size={14} style={{ 
                    position: 'absolute', 
                    left: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#7B3FBF' 
                  }} />
                  <input
                    type="text"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Nome ou código do produto..."
                    style={{ 
                      width: '100%', 
                      padding: '12px 12px 12px 40px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: 8, 
                      background: '#fff',
                      color: '#4B0082',
                      fontSize: 14
                    }}
                  />
                </div>
              </div>

              {/* Filtro por categoria */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Categoria:</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  style={{ 
                    padding: '12px', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: 8, 
                    background: '#fff',
                    color: '#4B0082',
                    fontSize: 14
                  }}
                >
                  {categoriasMock.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150 }}>
                <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600 }}>Status:</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  style={{ 
                    padding: '12px', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: 8, 
                    background: '#fff',
                    color: '#4B0082',
                    fontSize: 14
                  }}
                >
                  <option value="todos">Todos</option>
                  <option value="baixo">Estoque Baixo</option>
                  <option value="normal">Estoque Normal</option>
                </select>
              </div>
            </div>
          )}

          {/* KPIs */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 20, 
            marginBottom: 32 
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaBoxes size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Total de Produtos</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.totalProdutos}</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaExclamationTriangle size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Estoque Baixo</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.estoqueBaixo}</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaEye size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Valor Total</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {kpis.valorTotal.toFixed(2)}</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', 
              color: '#fff', 
              borderRadius: 12, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaExclamationTriangle size={20} />
                <span style={{ fontSize: 14, opacity: 0.9 }}>Críticos</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.produtosCriticos}</div>
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            padding: 24, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #F3F0FA'
          }}>
            <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Produtos em Estoque</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #F3F0FA' }}>
                                    <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Foto</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Código</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Produto</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Categoria</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#4B0082', fontWeight: 600 }}>Preço</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Estoque</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Mínimo</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#4B0082', fontWeight: 600 }}>Fornecedor</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#4B0082', fontWeight: 600 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto) => {
                    const estoqueBaixo = produto.estoque < produto.estoqueMinimo;
                    const estoqueCritico = produto.estoque <= produto.estoqueMinimo * 0.5;
                    
                    return (
                      <tr key={produto.id} style={{ 
                        borderBottom: '1px solid #F3F0FA',
                        background: estoqueCritico ? '#ffebee' : estoqueBaixo ? '#fff3e0' : 'transparent'
                      }}>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {produto.foto ? (
                            <img 
                              src={produto.foto} 
                              alt={produto.nome}
                              style={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: 6, 
                                objectFit: 'cover',
                                border: '2px solid #F3F0FA'
                              }}
                              title={`Foto do ${produto.nome}`}
                              onError={(e) => {
                                // Fallback se a imagem não carregar
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            style={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: 6, 
                              background: '#4CAF50',
                              color: 'white',
                              display: produto.foto ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 'bold',
                              border: '2px solid #F3F0FA'
                            }}
                            title={`Foto do ${produto.nome}`}
                          >
                            {produto.nome.substring(0, 2).toUpperCase()}
                          </div>
                        </td>
                        <td style={{ padding: '12px', color: '#4B0082', fontWeight: 600 }}>{produto.codigo}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{produto.nome}</td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{produto.categoria}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#4B0082', fontWeight: 600 }}>
                          R$ {produto.preco.toFixed(2)}
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          textAlign: 'center', 
                          color: estoqueCritico ? '#f44336' : estoqueBaixo ? '#ff9800' : '#4caf50',
                          fontWeight: 600
                        }}>
                          {produto.estoque}
                          {estoqueCritico && <FaExclamationTriangle size={12} style={{ marginLeft: 4 }} />}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#4B0082' }}>
                          {produto.estoqueMinimo}
                        </td>
                        <td style={{ padding: '12px', color: '#4B0082' }}>{produto.fornecedor}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button
                              onClick={() => abrirEdicaoProduto(produto)}
                              style={{
                                background: '#7B3FBF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Editar Produto"
                            >
                              <FaEdit size={10} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleAjustarEstoque(produto)}
                              style={{
                                background: '#ff9800',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Ajustar Estoque"
                            >
                              <FaEdit size={10} />
                              Ajustar
                            </button>
                            <button
                              onClick={() => {
                                // Lógica para excluir produto
                                if (window.confirm(`Deseja realmente excluir o produto "${produto.nome}"?`)) {
                                  setProdutosMock(prev => prev.filter(p => p.id !== produto.id));
                                }
                              }}
                              style={{
                                background: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Excluir Produto"
                            >
                              <FaTrash size={10} />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {produtosFiltrados.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#999', 
                fontSize: 16 
              }}>
                Nenhum produto encontrado com os filtros aplicados.
              </div>
            )}
          </div>

          {/* Modal de Ajuste de Estoque (simplificado) */}
          {mostrarModal && produtoSelecionado && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                maxWidth: 400,
                width: '90%',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
              }}>
                <h3 style={{ color: '#4B0082', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Ajustar Estoque - {produtoSelecionado.nome}
                </h3>
                <p style={{ color: '#666', marginBottom: 20 }}>
                  Estoque atual: {produtoSelecionado.estoque} unidades
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setMostrarModal(false)}
                    style={{
                      background: '#e0e0e0',
                      color: '#666',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 20px',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Aqui seria implementada a lógica de ajuste
                      setMostrarModal(false);
                      alert('Ajuste de estoque implementado! (mock)');
                    }}
                    style={{
                      background: '#4B0082',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 20px',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de cadastro/ajuste de produto */}
          {modalCadastro && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2000
            }}>
              <form onSubmit={handleCadastrarProduto} style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                width: '90%',
                maxWidth: 420,
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <h2 style={{ color: '#4B0082', fontSize: 20, fontWeight: 600, margin: 0 }}>
                  {modoEdicao ? 'Editar Produto' : 'Cadastrar Produto'}
                </h2>
                <input name="nome" value={formProduto.nome} onChange={handleFormChange} placeholder="Nome do produto" style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
                <input name="categoria" value={formProduto.categoria} onChange={handleFormChange} placeholder="Categoria" style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
                <input name="fornecedor" value={formProduto.fornecedor} onChange={handleFormChange} placeholder="Fornecedor" style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
                <input name="quantidade" type="number" value={formProduto.quantidade} onChange={handleFormChange} placeholder="Quantidade" style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
                <input name="valorCompra" type="number" step="0.01" value={formProduto.valorCompra} onChange={handleFormChange} placeholder="Valor de compra (R$)" style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input name="margem" type="number" step="0.01" value={formProduto.margem} onChange={handleFormChange} placeholder="Margem (%)" style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
                  <input name="valorVenda" type="number" step="0.01" value={formProduto.valorVenda} onChange={handleFormChange} placeholder="Valor de venda (R$)" style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
                </div>
                
                {/* Seção de Foto - sempre visível para IA reconhecer */}
                <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
                  <label style={{ color: '#4B0082', fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>
                    📸 Foto do Produto (Essencial para IA reconhecer)
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <button type="button" onClick={abrirCamera} style={{ background: '#7B3FBF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}>
                      📷 Tirar Foto
                    </button>
                    <input type="file" accept="image/*" onChange={handleFotoChange} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #ccc' }} />
                  </div>
                  {fotoPreview ? (
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                      <img 
                        src={fotoPreview} 
                        alt="Foto do produto" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: 120, 
                          borderRadius: 8, 
                          border: '2px solid #4CAF50',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', e);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                        <p style={{ fontSize: 12, color: '#4CAF50', fontWeight: 'bold' }}>✅ Foto pronta para IA reconhecer</p>
                        <button 
                          type="button"
                          onClick={() => {
                            setFotoPreview(null);
                            setFormProduto(prev => ({ ...prev, foto: null }));
                          }}
                          style={{ 
                            background: '#f44336', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 4, 
                            padding: '4px 8px', 
                            fontSize: 10, 
                            cursor: 'pointer' 
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: 8, border: '2px dashed #ccc' }}>
                      <p style={{ color: '#999', fontSize: 14 }}>📸 Adicione uma foto para a IA reconhecer o produto</p>
                    </div>
                  )}
                </div>
                {feedback && <div style={{ color: '#4caf50', fontWeight: 600, marginBottom: 8 }}>{feedback}</div>}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setModalCadastro(false)} style={{ background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
                  <button type="submit" disabled={!formProduto.foto} style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: !formProduto.foto ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600 }}>
                    {modoEdicao ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal da câmera */}
          {showCamera && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.8)',
              zIndex: 3000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '90vw', maxWidth: 400, borderRadius: 12, marginBottom: 16 }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={capturarFoto} style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Capturar</button>
                <button onClick={() => setShowCamera(false)} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Comentários explicativos em português:
// - Layout responsivo que usa toda a largura disponível
// - Grid system para KPIs que se adapta ao tamanho da tela
// - Tabela com scroll horizontal para mobile
// - Destaque visual para produtos com estoque baixo/crítico
// - Sistema de filtros completo
// - Modal para ajuste de estoque
// - Integração futura: conectar com backend para dados reais
// - Ajuste de estoque: implementar lógica real de atualização
// - Exportação: integrar com sistema de relatórios real

export default EstoquePage; 