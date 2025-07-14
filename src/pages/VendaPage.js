import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  FaCamera, 
  FaQrcode, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaCheck, 
  FaTimes, 
  FaSync, 
  FaWifi, 
  FaTimesCircle, 
  FaUndo, 
  FaBolt,
  FaExclamationTriangle,
  FaSpinner,
  FaPrint,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import Navigation from '../components/Navigation';

// Componente de status online/offline otimizado para mobile
const StatusIndicator = ({ online, pendingCount }) => (
  <div style={{ 
    display: 'flex', 
    gap: 6, 
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 4, 
      padding: '8px 12px', 
      background: online ? '#4caf50' : '#f44336',
      color: '#fff',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minWidth: 'fit-content'
    }}>
      {online ? <FaWifi size={10} /> : <FaTimesCircle size={10} />}
      {online ? 'Online' : 'Offline'}
    </div>

    {pendingCount > 0 && (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 4, 
        padding: '8px 12px', 
        background: '#ff9800',
        color: '#fff',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minWidth: 'fit-content'
      }}>
        <FaSync size={10} />
        {pendingCount}
      </div>
    )}
  </div>
);

// Componente de captura de foto ultra otimizado para mobile
const PhotoCapture = ({ onPhotoCapture, loading, fotoPreview, onReset }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Função para fechar câmera
  const closeCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setVideoLoaded(false);
    setIsFullscreen(false);
  }, [stream]);

  // Função para abrir câmera
  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Seu navegador não suporta acesso à câmera.');
      return;
    }

    setShowCamera(true);
    setVideoLoaded(false);

    try {
      // Tenta câmera traseira primeiro (melhor para produtos)
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      };

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.log('Câmera traseira falhou, tentando frontal:', error);
        const frontConstraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 }
          },
          audio: false
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(frontConstraints);
      }
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        const videoTimeout = setTimeout(() => {
          if (!videoLoaded) {
            closeCamera();
            alert('Câmera não carregou. Tente novamente.');
          }
        }, 5000);

        videoRef.current.onloadedmetadata = () => {
          clearTimeout(videoTimeout);
          videoRef.current.play();
          setVideoLoaded(true);
        };

        videoRef.current.onerror = () => {
          clearTimeout(videoTimeout);
          closeCamera();
          alert('Erro na câmera. Tente novamente.');
        };
      }
    } catch (error) {
      console.log('Erro ao acessar câmera:', error);
      setShowCamera(false);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }, [closeCamera, videoLoaded]);

  // Função para tirar foto
  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'produto.jpg', { type: 'image/jpeg' });
          onPhotoCapture(file);
          closeCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  }, [onPhotoCapture, closeCamera]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Cleanup da câmera
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (showCamera) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header da câmera compacto */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.9)',
          color: '#fff',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10
        }}>
          <button 
            onClick={closeCamera}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              padding: 8,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaTimes size={16} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Foto do Produto</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={toggleMute}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>
            <button 
              onClick={toggleFullscreen}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
            </button>
          </div>
        </div>

        {/* Vídeo da câmera */}
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            style={{
              width: '100%',
              height: '100%',
              objectFit: isFullscreen ? 'contain' : 'cover'
            }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Overlay de foco otimizado */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isFullscreen ? 200 : 120,
            height: isFullscreen ? 200 : 120,
            border: '3px solid #fff',
            borderRadius: 12,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
            pointerEvents: 'none'
          }}></div>
          
          {/* Indicador de carregamento */}
          {!videoLoaded && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontSize: 14,
              textAlign: 'center',
              background: 'rgba(0,0,0,0.8)',
              padding: '16px',
              borderRadius: '12px'
            }}>
              <FaSpinner size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
              <div>Abrindo câmera...</div>
            </div>
          )}
        </div>

        {/* Controles da câmera otimizados para touch */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px 16px',
          background: 'rgba(0,0,0,0.9)',
          gap: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}>
          {videoLoaded ? (
            <button 
              onClick={takePhoto}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#fff',
                border: '4px solid #7B3FBF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <FaCamera size={28} color="#7B3FBF" />
            </button>
          ) : (
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#666',
              border: '4px solid #999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.5
            }}>
              <FaSpinner size={24} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      border: '2px dashed #7B3FBF',
      borderRadius: 16,
      padding: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: !fotoPreview ? 'pointer' : 'default',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {!fotoPreview ? (
        <div>
          <div style={{
            width: 70,
            height: 70,
            background: '#f8f9fa',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            border: '2px solid #e9ecef'
          }}>
            <FaCamera size={28} color="#7B3FBF" />
          </div>
          
          <h3 style={{ 
            color: '#495057', 
            fontSize: 16, 
            fontWeight: 600, 
            marginBottom: 6 
          }}>
            Capturar Foto
          </h3>
          
          <p style={{ 
            color: '#6c757d', 
            fontSize: 12, 
            marginBottom: 16 
          }}>
            Use a câmera para capturar o produto
          </p>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={openCamera}
              disabled={loading}
              data-camera-button
              style={{ 
                background: '#7B3FBF', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 12, 
                padding: '14px 28px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontSize: 15,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                margin: '0 auto',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(123, 63, 191, 0.3)',
                minHeight: '48px'
              }}
            >
              <FaCamera size={18} />
              Abrir Câmera
            </button>
          </div>
        </div>
      ) : (
        <div>
          <img 
            src={fotoPreview} 
            alt="Produto" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '120px', 
              borderRadius: 12,
              border: '3px solid #7B3FBF',
              marginBottom: 12
            }} 
          />
          <button 
            onClick={onReset}
            style={{ 
              background: '#dc3545', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '8px 16px', 
              cursor: 'pointer', 
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              margin: '0 auto',
              transition: 'all 0.2s ease',
              minHeight: '40px'
            }}
          >
            <FaUndo size={12} />
            Nova Foto
          </button>
        </div>
      )}
    </div>
  );
};

// Componente de QR Code Pix
const PixQRCode = ({ valor, onPaymentConfirmed, onCancel }) => {
  const [paymentStatus, setPaymentStatus] = useState('waiting'); // waiting, processing, confirmed, failed
  const [countdown, setCountdown] = useState(300); // 5 minutos
  const [qrCodeData, setQrCodeData] = useState('');

  // Gerar QR Code Pix mockado
  useEffect(() => {
    const generatePixQR = () => {
      // Mock: Gera um QR code fictício
      const pixData = {
        valor: valor,
        chave: 'pix@empresa.com',
        beneficiario: 'Empresa LTDA',
        cidade: 'São Paulo',
        identificador: `PIX${Date.now()}`
      };
      
      // Simula dados do QR Code (na implementação real seria gerado pelo backend)
      const qrString = `00020126580014br.gov.bcb.pix0136${pixData.chave}520400005303986540${valor}5802BR5913${pixData.beneficiario}6008${pixData.cidade}62070503${pixData.identificador}6304`;
      setQrCodeData(qrString);
    };

    generatePixQR();
  }, [valor]);

  // Simular confirmação de pagamento
  useEffect(() => {
    if (paymentStatus === 'waiting') {
      // Mock: Simula confirmação de pagamento após 10-30 segundos
      const randomTime = Math.random() * 20000 + 10000; // 10-30 segundos
      
      const paymentTimer = setTimeout(() => {
        setPaymentStatus('processing');
        
        // Simula processamento
        setTimeout(() => {
          setPaymentStatus('confirmed');
          
          // Envia confirmação para o componente pai
          setTimeout(() => {
            onPaymentConfirmed();
          }, 1000);
          
        }, 2000);
        
      }, randomTime);

      return () => clearTimeout(paymentTimer);
    }
  }, [paymentStatus, onPaymentConfirmed]);

  // Countdown
  useEffect(() => {
    if (paymentStatus === 'waiting' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && paymentStatus === 'waiting') {
      setPaymentStatus('failed');
    }
  }, [countdown, paymentStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: '#fff',
      border: '2px solid #4caf50',
      borderRadius: 16,
      padding: 20,
      textAlign: 'center'
    }}>
      {paymentStatus === 'waiting' && (
        <>
          <h3 style={{ color: '#4caf50', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Pagamento via Pix
          </h3>
          
          <div style={{
            background: '#f8f9fa',
            border: '2px dashed #4caf50',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16
          }}>
            <div style={{
              width: 200,
              height: 200,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 8,
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#666'
            }}>
              QR Code Pix<br />
              R$ {valor}
            </div>
            
            <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
              Escaneie o QR Code com seu app bancário
            </p>
            
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: 8,
              padding: 8,
              fontSize: 12,
              color: '#856404'
            }}>
              ⏱️ Tempo restante: {formatTime(countdown)}
            </div>
          </div>
          
          <button 
            onClick={onCancel}
            style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Cancelar Pagamento
          </button>
        </>
      )}

      {paymentStatus === 'processing' && (
        <div style={{ padding: '40px 20px' }}>
          <FaSpinner size={32} color="#4caf50" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
          <h3 style={{ color: '#4caf50', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Processando Pagamento
          </h3>
          <p style={{ color: '#666', fontSize: 14 }}>
            Aguardando confirmação do banco...
          </p>
        </div>
      )}

      {paymentStatus === 'confirmed' && (
        <div style={{ padding: '40px 20px' }}>
          <FaCheck size={32} color="#4caf50" style={{ marginBottom: 16 }} />
          <h3 style={{ color: '#4caf50', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Pagamento Aprovado!
          </h3>
          <p style={{ color: '#666', fontSize: 14 }}>
            Notificação enviada para o WhatsApp
          </p>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div style={{ padding: '40px 20px' }}>
          <FaTimes size={32} color="#dc3545" style={{ marginBottom: 16 }} />
          <h3 style={{ color: '#dc3545', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Tempo Expirado
          </h3>
          <p style={{ color: '#666', fontSize: 14 }}>
            O pagamento não foi confirmado no tempo limite
          </p>
          <button 
            onClick={onCancel}
            style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              marginTop: 12
            }}
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

// Componente de forma de pagamento otimizado para mobile
const PaymentMethod = ({ selected, onSelect }) => {
  const methods = [
    { id: 'pix', label: 'Pix', icon: FaQrcode, color: '#4caf50' },
    { id: 'cartao', label: 'Cartão', icon: FaCreditCard, color: '#2196f3' },
    { id: 'dinheiro', label: 'Dinheiro', icon: FaMoneyBillWave, color: '#ff9800' }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: 8 
    }}>
      {methods.map(({ id, label, icon: Icon, color }) => (
        <button 
          key={id}
          onClick={() => onSelect(id)}
          style={{ 
            background: selected === id ? color : '#fff', 
            color: selected === id ? '#fff' : color, 
            border: `2px solid ${color}`, 
            borderRadius: 12, 
            padding: '12px 8px', 
            cursor: 'pointer', 
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s ease',
            minHeight: '70px',
            minWidth: '80px'
          }}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </div>
  );
};

// Componente de valor e troco otimizado para mobile
const ValueInput = ({ valorVenda, setValorVenda, formaPagamento, valorRecebido, setValorRecebido, troco }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div>
      <label style={{ display: 'block', color: '#495057', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        Valor da Venda (R$)
      </label>
      <input
        type="number"
        value={valorVenda}
        onChange={(e) => setValorVenda(e.target.value)}
        placeholder="0,00"
        step="0.01"
        min="0"
        style={{ 
          width: '100%', 
          padding: '14px', 
          border: '2px solid #e9ecef', 
          borderRadius: 12, 
          fontSize: 16,
          color: '#495057',
          background: '#fff',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          minHeight: '48px'
        }}
        onFocus={(e) => e.target.style.borderColor = '#7B3FBF'}
        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
      />
    </div>

    {formaPagamento === 'dinheiro' && (
      <>
        <div>
          <label style={{ display: 'block', color: '#495057', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Valor Recebido (R$)
          </label>
          <input
            type="number"
            value={valorRecebido}
            onChange={(e) => setValorRecebido(e.target.value)}
            placeholder="0,00"
            step="0.01"
            min={valorVenda}
            style={{ 
              width: '100%', 
              padding: '14px', 
              border: '2px solid #e9ecef', 
              borderRadius: 12, 
              fontSize: 16,
              color: '#495057',
              background: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              minHeight: '48px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7B3FBF'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', color: '#495057', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Troco (R$)
          </label>
          <div style={{ 
            padding: '14px', 
            background: '#e8f5e8', 
            border: '2px solid #4caf50', 
            borderRadius: 12, 
            fontSize: 18,
            color: '#2e7d32',
            fontWeight: 600,
            textAlign: 'center',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            R$ {troco.toFixed(2)}
          </div>
        </div>
      </>
    )}
  </div>
);

// Função para imprimir cupom otimizada para mobile
const imprimirCupom = (venda) => {
  const cupomContent = `
    <div style="font-family: monospace; max-width: 280px; margin: 0 auto; padding: 16px;">
      <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 8px;">
        <h2 style="margin: 0; font-size: 16px;">${venda.produto.nome}</h2>
        <p style="margin: 4px 0; font-size: 11px;">Código: ${venda.produto.codigo}</p>
        <p style="margin: 4px 0; font-size: 11px;">${venda.produto.categoria}</p>
      </div>
      
      <div style="margin: 8px 0;">
        <div style="display: flex; justify-content: space-between; margin: 4px 0;">
          <span>Valor:</span>
          <span>R$ ${venda.valorVenda.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 4px 0;">
          <span>Pagamento:</span>
          <span>${venda.formaPagamento.toUpperCase()}</span>
        </div>
        ${venda.valorRecebido ? `
        <div style="display: flex; justify-content: space-between; margin: 4px 0;">
          <span>Recebido:</span>
          <span>R$ ${venda.valorRecebido.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 4px 0;">
          <span>Troco:</span>
          <span>R$ ${venda.troco.toFixed(2)}</span>
        </div>
        ` : ''}
      </div>
      
      <div style="border-top: 1px solid #000; padding-top: 8px; margin-top: 8px; text-align: center;">
        <p style="margin: 4px 0; font-size: 11px;">Data: ${new Date(venda.data).toLocaleString('pt-BR')}</p>
        <p style="margin: 4px 0; font-size: 11px;">Operador: Sistema PDV</p>
      </div>
      
      <div style="text-align: center; margin-top: 16px; font-size: 9px;">
        <p>--- Via Loja ---</p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Cupom de Venda</title>
        <style>
          body { margin: 0; padding: 0; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${cupomContent}
        <div style="page-break-after: always;"></div>
        ${cupomContent.replace('--- Via Loja ---', '--- Via Cliente ---')}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

// Página principal de vendas
function VendaPage() {
  // Estados principais
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [produtoConfirmado, setProdutoConfirmado] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [valorRecebido, setValorRecebido] = useState('');
  const [troco, setTroco] = useState(0);
  const [vendaConcluida, setVendaConcluida] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusOnline, setStatusOnline] = useState(true);
  const [vendasOffline, setVendasOffline] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Estados para fluxo Pix
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [pixPaymentConfirmed, setPixPaymentConfirmed] = useState(false);

  // Produtos mockados para reconhecimento IA
  const produtosMock = useMemo(() => [
    { id: 1, nome: 'Arroz Integral 5kg', preco: 12.90, codigo: 'ARR001', categoria: 'Alimentos' },
    { id: 2, nome: 'Feijão Preto 1kg', preco: 8.50, codigo: 'FEJ001', categoria: 'Alimentos' },
    { id: 3, nome: 'Óleo de Soja 900ml', preco: 6.80, codigo: 'OLE001', categoria: 'Alimentos' },
    { id: 4, nome: 'Macarrão Espaguete 500g', preco: 3.90, codigo: 'MAC001', categoria: 'Alimentos' },
    { id: 5, nome: 'Café em Pó 500g', preco: 15.90, codigo: 'CAF001', categoria: 'Alimentos' },
    { id: 6, nome: 'Leite Integral 1L', preco: 4.50, codigo: 'LEI001', categoria: 'Laticínios' },
    { id: 7, nome: 'Pão de Forma 500g', preco: 5.90, codigo: 'PAO001', categoria: 'Padaria' },
    { id: 8, nome: 'Banana Prata 1kg', preco: 4.80, codigo: 'BAN001', categoria: 'Frutas' },
  ], []);

  // Verificar status online e abrir câmera automaticamente
  useEffect(() => {
    const checkOnlineStatus = () => {
      setStatusOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    checkOnlineStatus();

    // Carregar vendas offline salvas
    const vendasSalvas = localStorage.getItem('vendasOffline');
    if (vendasSalvas) {
      setVendasOffline(JSON.parse(vendasSalvas));
    }

    // Abrir câmera automaticamente após 1 segundo (mobile-first)
    const timer = setTimeout(() => {
      if (!foto && !loading) {
        const cameraButton = document.querySelector('[data-camera-button]');
        if (cameraButton) {
          cameraButton.click();
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
      clearTimeout(timer);
    };
  }, [foto, loading]);

  // Sincronizar vendas offline quando voltar online
  useEffect(() => {
    if (statusOnline && vendasOffline.length > 0) {
      sincronizarVendasOffline();
    }
  }, [statusOnline, vendasOffline]);

  // Calcular troco automaticamente
  useEffect(() => {
    if (formaPagamento === 'dinheiro' && valorVenda && valorRecebido) {
      const trocoCalculado = parseFloat(valorRecebido) - parseFloat(valorVenda);
      setTroco(trocoCalculado >= 0 ? trocoCalculado : 0);
    } else {
      setTroco(0);
    }
  }, [valorVenda, valorRecebido, formaPagamento]);

  // Função para capturar foto
  const handlePhotoCapture = useCallback((file) => {
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
    simularReconhecimentoIA();
  }, []);

  // MOCK: Simular reconhecimento IA - reconhece automaticamente e continua
  // TODO: Integrar com IA real (Java backend) depois
  const simularReconhecimentoIA = useCallback(() => {
      setLoading(true);
      setErro('');

    setTimeout(() => {
      const produtoAleatorio = produtosMock[Math.floor(Math.random() * produtosMock.length)];
      // Reconhece automaticamente e já confirma o produto
      setProdutoConfirmado(produtoAleatorio);
      setValorVenda(produtoAleatorio.preco.toString());
      setLoading(false);
      
      // Mostra sucesso do reconhecimento
      setSucesso(`Produto reconhecido: ${produtoAleatorio.nome}`);
      setTimeout(() => setSucesso(''), 2000);
    }, 1500); // Simula tempo de processamento da IA
  }, [produtosMock]);

  // Função para editar produto (se necessário)
  const editarProduto = useCallback(() => {
    setProdutoConfirmado(null);
    setValorVenda('');
  }, []);

  // Função para iniciar pagamento Pix
  const iniciarPagamentoPix = useCallback(() => {
    if (!valorVenda || parseFloat(valorVenda) <= 0) {
      setErro('Valor da venda é obrigatório!');
      return;
    }
    setShowPixPayment(true);
    setErro('');
  }, [valorVenda]);

  // Função para confirmar pagamento Pix
  const confirmarPagamentoPix = useCallback(() => {
    setPixPaymentConfirmed(true);
    setShowPixPayment(false);
    
    // Simula envio de notificação WhatsApp
    enviarNotificacaoWhatsApp();
    
    // Finaliza a venda automaticamente
    setTimeout(() => {
      finalizarVendaComPix();
    }, 1000);
  }, []);

  // Função para cancelar pagamento Pix
  const cancelarPagamentoPix = useCallback(() => {
    setShowPixPayment(false);
    setPixPaymentConfirmed(false);
  }, []);

  // Função para enviar notificação WhatsApp (mock)
  const enviarNotificacaoWhatsApp = useCallback(() => {
    const dadosNotificacao = {
      destinatario: '+5511999999999', // TODO: Pegar do contexto do dono
      mensagem: `🛒 *Nova Venda Realizada!*

📦 *Produto:* ${produtoConfirmado?.nome}
💰 *Valor:* R$ ${valorVenda}
💳 *Forma:* Pix
🕐 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}
🏪 *Operador:* Sistema PDV

✅ Pagamento confirmado automaticamente!`,
      timestamp: new Date().toISOString()
    };

    console.log('📱 Enviando notificação WhatsApp:', dadosNotificacao);
    
    // TODO: Integrar com API real do WhatsApp (Twilio, Z-API, etc.)
    // await api.post('/whatsapp/enviar', dadosNotificacao);
    
    // Mock: Simula envio
    setTimeout(() => {
      console.log('✅ Notificação WhatsApp enviada com sucesso!');
    }, 500);
  }, [produtoConfirmado, valorVenda]);

  // Função para finalizar venda com Pix
  const finalizarVendaComPix = useCallback(async () => {
    if (!foto) {
      setErro('Foto do produto é obrigatória!');
      return;
    }

    if (!produtoConfirmado) {
      setErro('Produto deve ser confirmado!');
      return;
    }

    if (!pixPaymentConfirmed) {
      setErro('Pagamento Pix deve ser confirmado!');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const venda = {
        id: Date.now(),
        foto: fotoPreview,
        produto: produtoConfirmado,
        valorVenda: parseFloat(valorVenda),
        formaPagamento: 'pix',
        valorRecebido: parseFloat(valorVenda),
        troco: 0,
        data: new Date().toISOString(),
        status: statusOnline ? 'online' : 'offline',
        pixConfirmado: true,
        whatsappEnviado: true
      };

      if (statusOnline) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Venda Pix enviada para backend:', venda);
      } else {
        const novasVendasOffline = [...vendasOffline, venda];
        setVendasOffline(novasVendasOffline);
        localStorage.setItem('vendasOffline', JSON.stringify(novasVendasOffline));
      }

      // Imprime o cupom em background
    setTimeout(() => {
        imprimirCupom(venda);
      }, 100);

      // Registra venda no financeiro (SIA)
      registrarVendaNoFinanceiro(venda);

      setVendaConcluida(true);
      setSucesso('Venda Pix realizada com sucesso! Notificação enviada.');

      // Aguarda mais tempo para o usuário ver a confirmação antes de resetar
      setTimeout(() => {
        resetarVenda();
      }, 3000);

    } catch (error) {
      setErro('Erro ao finalizar venda Pix. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [foto, produtoConfirmado, pixPaymentConfirmed, valorVenda, statusOnline, vendasOffline, fotoPreview]);

  // Função para finalizar venda
  const finalizarVenda = useCallback(async () => {
    if (!foto) {
      setErro('Foto do produto é obrigatória!');
      return;
    }

    if (!produtoConfirmado) {
      setErro('Produto deve ser confirmado!');
      return;
    }

    if (!formaPagamento) {
      setErro('Selecione a forma de pagamento!');
      return;
    }

    if (!valorVenda || parseFloat(valorVenda) <= 0) {
      setErro('Valor da venda é obrigatório!');
      return;
    }

    if (formaPagamento === 'dinheiro' && (!valorRecebido || parseFloat(valorRecebido) < parseFloat(valorVenda))) {
      setErro('Valor recebido deve ser maior ou igual ao valor da venda!');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const venda = {
        id: Date.now(),
        foto: fotoPreview,
        produto: produtoConfirmado,
        valorVenda: parseFloat(valorVenda),
        formaPagamento,
        valorRecebido: formaPagamento === 'dinheiro' ? parseFloat(valorRecebido) : null,
        troco: formaPagamento === 'dinheiro' ? troco : null,
        data: new Date().toISOString(),
        status: statusOnline ? 'online' : 'offline'
      };

      if (statusOnline) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Venda enviada para backend:', venda);
      } else {
        const novasVendasOffline = [...vendasOffline, venda];
        setVendasOffline(novasVendasOffline);
        localStorage.setItem('vendasOffline', JSON.stringify(novasVendasOffline));
      }

      // Imprime o cupom em background para não bloquear a interface
      setTimeout(() => {
        imprimirCupom(venda);
      }, 100);

      // Registra venda no financeiro (SIA) - Integração automática
      registrarVendaNoFinanceiro(venda);

      setVendaConcluida(true);
      setSucesso(statusOnline ? 'Venda realizada com sucesso!' : 'Venda salva offline! Será sincronizada quando conectar.');

      // Aguarda mais tempo para o usuário ver a confirmação antes de resetar
      setTimeout(() => {
        resetarVenda();
      }, 3000);

    } catch (error) {
      setErro('Erro ao finalizar venda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [foto, produtoConfirmado, formaPagamento, valorVenda, valorRecebido, troco, statusOnline, vendasOffline, fotoPreview]);

  // Função para registrar venda no financeiro (SIA)
  const registrarVendaNoFinanceiro = useCallback(async (venda) => {
    try {
      // Dados da venda para o financeiro
      const dadosFinanceiro = {
        id: venda.id,
        data: venda.data,
        produto: {
          codigo: venda.produto.codigo,
          nome: venda.produto.nome,
          categoria: venda.produto.categoria,
          preco: venda.produto.preco
        },
        valorVenda: venda.valorVenda,
        formaPagamento: venda.formaPagamento,
        valorRecebido: venda.valorRecebido,
        troco: venda.troco,
        status: venda.status,
        tipo: 'VENDA_SIA', // Identifica como venda do sistema SIA
        operador: 'Sistema PDV', // TODO: Pegar do contexto de autenticação
        timestamp: new Date().toISOString()
      };

      if (statusOnline) {
        // Envia para o backend Java (financeiro)
        console.log('📊 Registrando venda no financeiro (SIA):', dadosFinanceiro);
        
        // TODO: Integrar com API real do backend Java
        // await api.post('/financeiro/vendas', dadosFinanceiro);
        
        // Simulação de envio para o financeiro
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('✅ Venda registrada no financeiro com sucesso!');
        
      } else {
        // Salva localmente para sincronizar depois
        const vendasFinanceiroOffline = JSON.parse(localStorage.getItem('vendasFinanceiroOffline') || '[]');
        vendasFinanceiroOffline.push(dadosFinanceiro);
        localStorage.setItem('vendasFinanceiroOffline', JSON.stringify(vendasFinanceiroOffline));
        
        console.log('💾 Venda salva offline para sincronização com financeiro');
      }
      
    } catch (error) {
      console.error('❌ Erro ao registrar venda no financeiro:', error);
      // Não bloqueia o fluxo da venda, apenas loga o erro
    }
  }, [statusOnline]);

  // Função para sincronizar vendas offline (incluindo financeiro)
  const sincronizarVendasOffline = useCallback(async () => {
    const vendasParaSincronizar = vendasOffline.length;
    const vendasFinanceiroOffline = JSON.parse(localStorage.getItem('vendasFinanceiroOffline') || '[]');
    const vendasFinanceiroParaSincronizar = vendasFinanceiroOffline.length;
    
    if (vendasParaSincronizar === 0 && vendasFinanceiroParaSincronizar === 0) return;

    setLoading(true);
    try {
      // Sincroniza vendas principais
      if (vendasParaSincronizar > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      setVendasOffline([]);
      localStorage.removeItem('vendasOffline');
      }
      
      // Sincroniza vendas do financeiro
      if (vendasFinanceiroParaSincronizar > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Integrar com API real do backend Java
        // for (const venda of vendasFinanceiroOffline) {
        //   await api.post('/financeiro/vendas', venda);
        // }
        
        localStorage.removeItem('vendasFinanceiroOffline');
        console.log('📊 Vendas do financeiro sincronizadas:', vendasFinanceiroParaSincronizar);
      }
      
      const totalSincronizado = vendasParaSincronizar + vendasFinanceiroParaSincronizar;
      setSucesso(`${totalSincronizado} vendas sincronizadas com sucesso!`);
      setTimeout(() => setSucesso(''), 3000);
      
    } catch (error) {
      setErro('Erro ao sincronizar vendas offline.');
    } finally {
      setLoading(false);
    }
  }, [vendasOffline]);

  // Função para resetar venda
  const resetarVenda = useCallback(() => {
    setFoto(null);
    setFotoPreview(null);
    setProdutoConfirmado(null);
    setFormaPagamento('');
    setValorVenda('');
    setValorRecebido('');
    setTroco(0);
    setVendaConcluida(false);
    setErro('');
    setSucesso('');
    setShowPixPayment(false);
    setPixPaymentConfirmed(false);
  }, []);

  // Atalhos de teclado e gestos para mobile
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !loading && !vendaConcluida) {
        if (foto && produtoConfirmado && formaPagamento && valorVenda) {
          finalizarVenda();
        }
      }
      if (event.key === 'Escape') {
        resetarVenda();
      }
    };

    // Gestos para mobile (swipe para resetar)
    let startY = 0;
    let startX = 0;
    
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = startY - endY;
      const deltaX = startX - endX;

      // Swipe para baixo para resetar venda
      if (deltaY > 100 && Math.abs(deltaX) < 50) {
        resetarVenda();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [foto, produtoConfirmado, formaPagamento, valorVenda, loading, vendaConcluida, finalizarVenda, resetarVenda]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navigation />
      
      <div style={{ 
        padding: '12px', 
        maxWidth: '100%',
        margin: '0 auto'
      }} className="mobile-landscape">
        {/* Header da página otimizado para mobile */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #7B3FBF 0%, #4B0082 100%)',
              borderRadius: 10,
              padding: 8,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <FaBolt size={16} color="#fff" />
            </div>
            <div>
              <h1 style={{ 
                color: '#495057', 
                fontSize: 18, 
                fontWeight: 700, 
                margin: 0,
                marginBottom: 2
              }}>
                Vendas Ultra Rápidas
              </h1>
              <p style={{ 
                color: '#6c757d', 
              fontSize: 12,
                margin: 0 
            }}>
                PDV Mobile
              </p>
            </div>
          </div>
          
          <StatusIndicator 
            online={statusOnline} 
            pendingCount={vendasOffline.length + (JSON.parse(localStorage.getItem('vendasFinanceiroOffline') || '[]').length)} 
          />
        </div>

        {/* Mensagens de feedback otimizadas para mobile */}
        {erro && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: 10, 
            padding: '10px 12px', 
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#856404'
          }}>
            <FaExclamationTriangle size={14} />
            <span style={{ fontWeight: 600, fontSize: 13 }}>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div style={{ 
            background: '#d4edda', 
            border: '1px solid #c3e6cb', 
            borderRadius: 10, 
            padding: '10px 12px', 
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#155724'
          }}>
            <FaCheck size={14} />
            <span style={{ fontWeight: 600, fontSize: 13 }}>{sucesso}</span>
          </div>
        )}

        {/* Loading otimizado para mobile */}
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '30px 16px',
            color: '#7B3FBF'
          }}>
            <FaSpinner size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginLeft: 10, fontSize: 14, fontWeight: 600 }}>
              {vendaConcluida ? 'Processando venda...' : 'Processando...'}
            </span>
          </div>
        )}

        {/* Conteúdo principal otimizado para mobile */}
        {!loading && !vendaConcluida && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Captura de Foto */}
                <div>
              <h2 style={{ 
                color: '#495057', 
                      fontSize: 16,
                      fontWeight: 600,
                marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                gap: 6
              }}>
                <FaCamera size={14} color="#7B3FBF" />
                1. Foto do Produto
              </h2>
              <PhotoCapture 
                onPhotoCapture={handlePhotoCapture}
                loading={loading}
                fotoPreview={fotoPreview}
                onReset={resetarVenda}
              />
                </div>

            {/* Produto Reconhecido pela IA */}
            {produtoConfirmado && (
                <div>
                <h2 style={{ 
                  color: '#495057', 
                  fontSize: 16, 
                        fontWeight: 600,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <FaQrcode size={14} color="#7B3FBF" />
                  2. Produto Reconhecido pela IA
                </h2>
                
                <div style={{ 
                  background: '#e8f5e8',
                  border: '2px solid #4caf50',
                  borderRadius: 12, 
                  padding: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 45, 
                      height: 45, 
                      background: '#4caf50', 
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 11
                    }}>
                      {produtoConfirmado.codigo}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#2e7d32', marginBottom: 3 }}>
                        {produtoConfirmado.nome}
                      </div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 3 }}>
                        {produtoConfirmado.categoria}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#4caf50' }}>
                        R$ {produtoConfirmado.preco.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ 
                      background: '#4caf50', 
                      color: '#fff', 
                      padding: '3px 6px', 
                      borderRadius: 4, 
                      fontSize: 9, 
                      fontWeight: 600 
                    }}>
                      IA
                  </div>
                </div>
                    </div>
                  </div>
                )}

            {/* Forma de Pagamento */}
            {produtoConfirmado && (
              <div>
                <h2 style={{ 
                  color: '#495057', 
                      fontSize: 16,
                      fontWeight: 600,
                  marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                  gap: 6
                }}>
                  <FaCreditCard size={14} color="#7B3FBF" />
                  3. Forma de Pagamento
                </h2>
                
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e9ecef',
                      borderRadius: 12, 
                  padding: 16
                }}>
                  <PaymentMethod 
                    selected={formaPagamento}
                    onSelect={setFormaPagamento}
                  />
                  
                  {formaPagamento && (
                    <div style={{ marginTop: 16 }}>
                      <ValueInput 
                        valorVenda={valorVenda}
                        setValorVenda={setValorVenda}
                        formaPagamento={formaPagamento}
                        valorRecebido={valorRecebido}
                        setValorRecebido={setValorRecebido}
                        troco={troco}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fluxo Pix */}
            {showPixPayment && (
              <div>
                <h2 style={{ 
                  color: '#495057', 
                      fontSize: 16,
                      fontWeight: 600,
                  marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                  gap: 6
                }}>
                  <FaQrcode size={14} color="#4caf50" />
                  4. Pagamento Pix
                </h2>
                
                <PixQRCode 
                  valor={valorVenda}
                  onPaymentConfirmed={confirmarPagamentoPix}
                  onCancel={cancelarPagamentoPix}
                />
              </div>
            )}

            {/* Botão Finalizar (não Pix) */}
            {produtoConfirmado && formaPagamento && valorVenda && formaPagamento !== 'pix' && (
              <div style={{
                background: '#ffffff',
                border: '2px solid #4caf50',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center'
              }}>
                  <button 
                  onClick={finalizarVenda}
                  disabled={loading}
                    style={{ 
                    background: '#4caf50', 
                    color: '#fff', 
                    border: 'none', 
                      borderRadius: 12, 
                    padding: '14px 20px', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    fontSize: 15,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    gap: 10,
                    margin: '0 auto',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    justifyContent: 'center',
                    minHeight: '48px'
                  }}
                >
                  <FaCheck size={16} />
                  Finalizar Venda
                  <FaPrint size={14} />
                  </button>
                
                <p style={{ color: '#6c757d', fontSize: 11, marginTop: 10 }}>
                  Pressione <strong>Enter</strong> para finalizar rapidamente
                </p>
                  </div>
            )}

            {/* Botão Iniciar Pix */}
            {produtoConfirmado && formaPagamento === 'pix' && valorVenda && !showPixPayment && !pixPaymentConfirmed && (
                        <div style={{ 
                background: '#ffffff',
                          border: '2px solid #4caf50', 
                borderRadius: 12,
                padding: 16,
                textAlign: 'center'
              }}>
                <button 
                  onClick={iniciarPagamentoPix}
                  disabled={loading}
                  style={{ 
                    background: '#4caf50', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '14px 20px', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    fontSize: 15,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    margin: '0 auto',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    justifyContent: 'center',
                    minHeight: '48px'
                  }}
                >
                  <FaQrcode size={16} />
                  Gerar QR Code Pix
                </button>
                
                <p style={{ color: '#6c757d', fontSize: 11, marginTop: 10 }}>
                  Cliente escaneia o QR Code para pagar
                </p>
              </div>
            )}
          </div>
        )}

        {/* Venda Concluída otimizada para mobile */}
        {vendaConcluida && (
          <div style={{ 
            padding: '30px 16px', 
            textAlign: 'center',
            background: '#e8f5e8',
            borderRadius: 12,
            border: '2px solid #4caf50'
          }}>
            <FaCheck size={36} color="#4caf50" style={{ marginBottom: 10 }} />
            <h2 style={{ color: '#2e7d32', fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
              Venda Concluída!
            </h2>
            <p style={{ color: '#666', fontSize: 14 }}>
              {statusOnline ? 'Venda processada com sucesso.' : 'Venda salva offline para sincronização.'}
            </p>
            <p style={{ color: '#999', fontSize: 11, marginTop: 6 }}>
              Preparando nova venda...
            </p>
          </div>
        )}

        {/* CSS para animações e mobile */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          /* Otimizações para mobile */
          @media (max-width: 768px) {
            body {
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            input, textarea {
              -webkit-user-select: text;
              -khtml-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }
          }
          
          /* Orientação landscape para mobile */
          @media (max-width: 768px) and (orientation: landscape) {
            .mobile-landscape {
              padding: 8px !important;
            }
            
            .mobile-landscape h1 {
              font-size: 16px !important;
            }
            
            .mobile-landscape h2 {
              font-size: 14px !important;
            }
          }
          
          /* Prevenir zoom em inputs no iOS */
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            input[type="number"] {
              font-size: 16px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default VendaPage; 