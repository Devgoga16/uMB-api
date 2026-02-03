const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'uMB API - Documentación',
      version: '1.0.0',
      description: 'API RESTful con autenticación JWT y gestión de usuarios',
      contact: {
        name: 'API Support',
        email: 'support@umb.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.umb.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID del usuario'
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'Contraseña del usuario'
            },
            rol: {
              type: 'string',
              enum: ['usuario', 'admin'],
              default: 'usuario',
              description: 'Rol del usuario'
            },
            activo: {
              type: 'boolean',
              default: true,
              description: 'Estado del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            data: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        UsersResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            cantidad: {
              type: 'number'
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            mensaje: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string'
                },
                nombre: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                rol: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            mensaje: {
              type: 'string'
            },
            error: {
              type: 'string'
            }
          }
        },
        Bot: {
          type: 'object',
          required: ['nombre', 'url', 'apiKey'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID del bot'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del bot'
            },
            url: {
              type: 'string',
              description: 'URL del despliegue del bot'
            },
            apiKey: {
              type: 'string',
              description: 'API Key para autenticar con el bot'
            },
            plan: {
              type: 'object',
              properties: {
                tipo: {
                  type: 'string',
                  enum: ['basico', 'profesional', 'empresarial'],
                  description: 'Tipo de plan'
                },
                precio: {
                  type: 'number',
                  description: 'Precio mensual del plan'
                },
                limites: {
                  type: 'object',
                  properties: {
                    mensajesWhatsApp: {
                      type: 'number',
                      description: 'Mensajes de WhatsApp incluidos en el plan'
                    },
                    correos: {
                      type: 'number',
                      description: 'Correos incluidos en el plan'
                    }
                  }
                },
                costosExtras: {
                  type: 'object',
                  properties: {
                    mensajeWhatsApp: {
                      type: 'number',
                      description: 'Costo por mensaje de WhatsApp extra'
                    },
                    correo: {
                      type: 'number',
                      description: 'Costo por correo extra'
                    }
                  }
                }
              }
            },
            estado: {
              type: 'string',
              enum: ['activo', 'inactivo', 'mantenimiento'],
              default: 'activo',
              description: 'Estado actual del bot'
            },
            configuracion: {
              type: 'object',
              properties: {
                mensajeBienvenida: {
                  type: 'string'
                },
                timeoutRespuesta: {
                  type: 'number'
                },
                maxConversaciones: {
                  type: 'number'
                }
              }
            },
            estadisticas: {
              type: 'object',
              properties: {
                mensajesWhatsAppEnviados: {
                  type: 'number'
                },
                correosEnviados: {
                  type: 'number'
                },
                mensajesRecibidos: {
                  type: 'number'
                },
                conversacionesActivas: {
                  type: 'number'
                }
              }
            },
            uso: {
              type: 'object',
              properties: {
                mensajesWhatsAppUsados: {
                  type: 'number',
                  description: 'Mensajes de WhatsApp usados en el período actual'
                },
                correosUsados: {
                  type: 'number',
                  description: 'Correos usados en el período actual'
                },
                ultimoReset: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Fecha del último reseteo de uso'
                }
              }
            },
            createdBy: {
              type: 'string',
              description: 'ID del usuario que creó el bot'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints de autenticación y registro'
      },
      {
        name: 'Usuarios',
        description: 'Gestión de usuarios (requiere permisos de administrador)'
      },
      {
        name: 'Bots',
        description: 'Gestión de bots de WhatsApp (requiere permisos de administrador)'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
