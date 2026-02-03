const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del bot es requerido'],
    trim: true,
    unique: true
  },
  url: {
    type: String,
    required: [true, 'La URL del bot es requerida'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Por favor ingrese una URL válida']
  },
  apiKey: {
    type: String,
    required: [true, 'La API Key es requerida'],
    trim: true
  },
  baseDatos: {
    type: String,
    required: [true, 'La base de datos es requerida'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    trim: true
  },
  plan: {
    tipo: {
      type: String,
      enum: ['basico', 'profesional', 'empresarial', 'standard'],
      default: 'basico'
    },
    precio: {
      type: Number,
      required: [true, 'El precio del plan es requerido'],
      min: 0
    },
    limites: {
      mensajesWhatsApp: {
        type: Number,
        required: [true, 'El límite de mensajes de WhatsApp es requerido'],
        min: 0,
        default: 1000
      },
      correos: {
        type: Number,
        required: [true, 'El límite de correos es requerido'],
        min: 0,
        default: 500
      }
    },
    costosExtras: {
      mensajeWhatsApp: {
        type: Number,
        required: [true, 'El costo por mensaje extra de WhatsApp es requerido'],
        min: 0,
        default: 0.05
      },
      correo: {
        type: Number,
        required: [true, 'El costo por correo extra es requerido'],
        min: 0,
        default: 0.02
      }
    }
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'mantenimiento'],
    default: 'activo'
  },
  configuracion: {
    mensajeBienvenida: {
      type: String,
      default: 'Hola, ¿en qué puedo ayudarte?'
    },
    timeoutRespuesta: {
      type: Number,
      default: 30000 // 30 segundos
    },
    maxConversaciones: {
      type: Number,
      default: 100
    }
  },
  estadisticas: {
    mensajesWhatsAppEnviados: {
      type: Number,
      default: 0
    },
    correosEnviados: {
      type: Number,
      default: 0
    },
    mensajesRecibidos: {
      type: Number,
      default: 0
    },
    conversacionesActivas: {
      type: Number,
      default: 0
    }
  },
  uso: {
    mensajesWhatsAppUsados: {
      type: Number,
      default: 0
    },
    correosUsados: {
      type: Number,
      default: 0
    },
    ultimoReset: {
      type: Date,
      default: Date.now
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar fecha de modificación antes de guardar
botSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Métodos para incrementar estadísticas
botSchema.methods.incrementarMensajesWhatsApp = function() {
  this.estadisticas.mensajesWhatsAppEnviados += 1;
  this.uso.mensajesWhatsAppUsados += 1;
  return this.save();
};

botSchema.methods.incrementarCorreos = function() {
  this.estadisticas.correosEnviados += 1;
  this.uso.correosUsados += 1;
  return this.save();
};

botSchema.methods.incrementarMensajesRecibidos = function() {
  this.estadisticas.mensajesRecibidos += 1;
  return this.save();
};

// Método para verificar si se excedieron los límites
botSchema.methods.verificarLimites = function() {
  return {
    whatsapp: {
      usado: this.uso.mensajesWhatsAppUsados,
      limite: this.plan.limites.mensajesWhatsApp,
      excedido: this.uso.mensajesWhatsAppUsados > this.plan.limites.mensajesWhatsApp,
      extras: Math.max(0, this.uso.mensajesWhatsAppUsados - this.plan.limites.mensajesWhatsApp),
      costoExtras: Math.max(0, this.uso.mensajesWhatsAppUsados - this.plan.limites.mensajesWhatsApp) * this.plan.costosExtras.mensajeWhatsApp
    },
    correos: {
      usado: this.uso.correosUsados,
      limite: this.plan.limites.correos,
      excedido: this.uso.correosUsados > this.plan.limites.correos,
      extras: Math.max(0, this.uso.correosUsados - this.plan.limites.correos),
      costoExtras: Math.max(0, this.uso.correosUsados - this.plan.limites.correos) * this.plan.costosExtras.correo
    }
  };
};

// Método para resetear uso mensual
botSchema.methods.resetearUso = function() {
  this.uso.mensajesWhatsAppUsados = 0;
  this.uso.correosUsados = 0;
  this.uso.ultimoReset = Date.now();
  return this.save();
};

module.exports = mongoose.model('Bot', botSchema);
