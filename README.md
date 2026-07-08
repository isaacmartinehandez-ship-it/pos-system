# POS System - SimplyGest Clone

Sistema de punto de venta moderno y completo inspirado en SimplyGest.

Repositorio: https://github.com/isaacmartinehandez-ship-it/pos-system

## Características

- 🛒 **Punto de Venta (TPV)**: Interfaz intuitiva para realizar ventas rápidas
- 📦 **Gestión de Artículos**: Productos, categorías, precios y stock
- 👥 **Gestión de Clientes**: Base de datos de clientes
- 📊 **Informes y Estadísticas**: Análisis de ventas y rendimiento
- 👤 **Gestión de Usuarios**: Permisos y roles
- 💳 **Múltiples Métodos de Pago**: Efectivo, tarjeta, transferencia
- 📱 **Responsive Design**: Funciona en tablets y computadoras

## Tech Stack

- **Next.js 15** - Framework React fullstack
- **TypeScript** - Tipado seguro
- **Tailwind CSS** - Estilos modernos
- **Zustand** - Gestión de estado
- **Lucide React** - Íconos

## Instalación

1. Asegúrate de tener Node.js instalado (versión 18 o superior)
2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura del Proyecto

```
pos-system/
├── src/
│   ├── app/              # Páginas de Next.js
│   │   ├── globals.css   # Estilos globales
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Página principal (POS)
│   └── store/            # Gestión de estado (Zustand)
│       └── index.ts      # Store principal
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Funcionalidades Principales

### Punto de Venta
- Añadir productos al carrito
- Modificar cantidades
- Métodos de pago múltiples
- Total automático

### Artículos
- Gestión de productos
- Categorías
- Control de stock
- Precios

### Clientes
- Base de datos de clientes
- Historial de compras

### Informes
- Ventas por período
- Estadísticas
- Exportación a Excel/PDF

## Próximas Funcionalidades

- 📈 Control horario de empleados
- 🏪 Multi-tienda
- 📱 App móvil
- 🖨️ Impresión de tickets
- 🎫 Vales descuento y gift cards
- 🔐 Control de acceso por tarjetas
- 📊 Diseñador de informes personalizados
