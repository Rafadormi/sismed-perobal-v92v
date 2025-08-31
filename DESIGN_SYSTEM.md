
# SISMED Perobal - Design System & Layout Guide

## 📋 Visão Geral

Este documento serve como guia completo para refatoração do design e layout do sistema SISMED Perobal, mantendo todas as funcionalidades existentes. O objetivo é modernizar a interface visual seguindo os padrões de design glassmorphism e criar uma experiência de usuário mais elegante e profissional.

## 🎨 Sistema de Design Atual vs. Proposto

### Paleta de Cores Atual
```css
/* Cores atuais do projeto (tailwind.config.ts) */
--health-50: '#e6f7f5'
--health-100: '#ccefe9'
--health-200: '#99e0d4'
--health-300: '#66d0c0'
--health-400: '#33c0ab'
--health-500: '#00b096'
--health-600: '#008d78'
--health-700: '#006a5a'
--health-800: '#00463c'
--health-900: '#00231e'
```

### Nova Paleta de Cores Proposta
```css
/* Cores modernas para implementar */
--primary: '#1d4ed8'      /* Azul principal */
--secondary: '#0e7490'    /* Azul-teal secundário */
--accent: '#0891b2'       /* Azul-cyan de destaque */
--dark: '#0f172a'         /* Azul escuro para textos */
--light: '#f0f9ff'        /* Azul muito claro para fundos */
```

## 🏗️ Estrutura de Layout

### 1. Sidebar Navigation
**Localização**: Todas as páginas principais
**Componente**: `src/components/Navbar.tsx`

#### Refatoração Necessária:
```typescript
// ANTES: Navbar horizontal simples
// DEPOIS: Sidebar vertical elegante com glassmorphism

// Estrutura proposta:
interface SidebarProps {
  currentPath: string;
  userInfo: {
    name: string;
    crm: string;
    avatar?: string;
  };
}

// Classes CSS a implementar:
.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
  border-top-right-radius: 35px;
  border-bottom-right-radius: 35px;
  box-shadow: 8px 0 30px rgba(0, 0, 0, 0.2);
}

.nav-link {
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 12px 20px;
  position: relative;
  overflow: hidden;
}
```

### 2. Dashboard Principal
**Localização**: `src/pages/Index.tsx`

#### Cards de Estatísticas
```typescript
// Componente a criar: src/components/dashboard/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'amber' | 'purple';
}

// Classes glassmorphism:
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### 3. Páginas de Gestão
**Localização**: `src/pages/Patients.tsx`, `src/pages/Medicines.tsx`, `src/pages/Prescriptions.tsx`

#### Estrutura de Layout Unificada
```typescript
// Layout padrão para todas as páginas
interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

// Componente: src/components/layout/PageLayout.tsx
const PageLayout = ({ title, subtitle, children, actions }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-blue-50">
      {/* Sidebar */}
      <ModernSidebar />
      
      {/* Conteúdo principal */}
      <div className="ml-72 p-8">
        <PageHeader title={title} subtitle={subtitle} actions={actions} />
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
```

## 🔧 Componentes Específicos para Refatoração

### 1. Sistema de Receitas
**Arquivos**: `src/components/prescriptions/*`

#### PrescriptionsTabs (src/components/prescriptions/PrescriptionsTabs.tsx)
```typescript
// MANTER funcionalidade, ATUALIZAR visual
// Implementar design de abas modernas:

.modern-tabs {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tab-trigger {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tab-trigger.active {
  background: linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
}
```

#### PrescriptionViewer (src/components/prescriptions/PrescriptionViewer.tsx)
```typescript
// MANTER funcionalidade de impressão, ATUALIZAR layout

// Versão tela: Card moderno glassmorphism
.prescription-viewer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
}

// Versão impressão: MANTER exatamente como está
// NÃO ALTERAR estilos de @media print
```

### 2. Formulários
**Arquivos**: `src/components/*Form.tsx`

#### Design de Formulários Modernos
```typescript
// Componentes base a criar:
// src/components/ui/modern-input.tsx
// src/components/ui/modern-button.tsx
// src/components/ui/modern-select.tsx

interface ModernInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'date';
  required?: boolean;
  error?: string;
}

// Estilos para inputs modernos:
.modern-input {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modern-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
  background: rgba(255, 255, 255, 0.95);
}
```

### 3. Tabelas de Dados
**Arquivos**: `src/components/PatientTable.tsx`, listas de medicamentos, etc.

#### Tabelas Modernas
```typescript
// Componente: src/components/ui/modern-table.tsx

interface ModernTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  loading?: boolean;
}

// Estilos para tabelas:
.modern-table {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.table-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.table-row:hover {
  background: rgba(29, 78, 216, 0.05);
  transform: translateX(4px);
}
```

## 📱 Responsividade

### Breakpoints
```css
/* Usar os breakpoints do Tailwind */
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Layout Responsivo
```typescript
// Mobile: Sidebar collapsa em drawer
// Tablet: Sidebar fica visível mas mais estreita
// Desktop: Sidebar completa

// Implementar em: src/components/layout/ResponsiveSidebar.tsx
const ResponsiveSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <>
      {/* Mobile: Drawer overlay */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Desktop: Sidebar fixo */}
      {!isMobile && (
        <div className="fixed left-0 top-0 w-72 h-full">
          <SidebarContent />
        </div>
      )}
    </>
  );
};
```

## 🎭 Animações e Interações

### Animações CSS
```css
/* Adicionar ao index.css */

/* Animação de entrada suave */
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover em cards */
.card-hover {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
}

/* Botões modernos */
.btn-modern {
  background: linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%);
  border-radius: 14px;
  padding: 14px 28px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.25);
}

.btn-modern:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 24px rgba(29, 78, 216, 0.35);
}
```

## 🔄 Plano de Migração

### Fase 1: Fundação
1. **Atualizar `tailwind.config.ts`** com nova paleta de cores
2. **Criar `src/components/layout/ModernLayout.tsx`**
3. **Refatorar `src/components/Navbar.tsx`** para sidebar moderna

### Fase 2: Componentes Base
1. **Criar componentes UI modernos:**
   - `src/components/ui/modern-input.tsx`
   - `src/components/ui/modern-button.tsx`
   - `src/components/ui/modern-card.tsx`
   - `src/components/ui/modern-table.tsx`

### Fase 3: Páginas Principais
1. **Dashboard (`src/pages/Index.tsx`)**
   - Implementar cards de estatísticas glassmorphism
   - Adicionar gráficos e métricas visuais
   
2. **Páginas de gestão**
   - Aplicar novo layout em Pacientes, Medicamentos, Receitas
   - Manter TODA funcionalidade existente

### Fase 4: Sistema de Receitas
1. **Atualizar visual das abas** (PrescriptionsTabs)
2. **Modernizar formulários** (PrescriptionForm)
3. **PRESERVAR funcionalidades:**
   - Múltiplas receitas por data
   - Logo oficial no cabeçalho
   - Posologia opcional
   - Sistema de impressão

## ⚠️ Funcionalidades que NÃO DEVEM ser alteradas

### 1. Sistema de Impressão
```typescript
// NÃO ALTERAR: Estilos @media print em PrescriptionViewer
// NÃO ALTERAR: Lógica de geração de PDF
// NÃO ALTERAR: Cabeçalho oficial com logo da prefeitura
```

### 2. Validações e Lógica de Negócio
```typescript
// MANTER: Todas as validações de formulário
// MANTER: Fluxo de criação de receitas
// MANTER: Sistema de múltiplas datas
// MANTER: Posologia opcional com fallback
```

### 3. Integração com Backend
```typescript
// NÃO ALTERAR: Hooks de API (useMedicines, usePatients, usePrescriptions)
// NÃO ALTERAR: Serviços de API (src/services/api.js)
// NÃO ALTERAR: Tipos TypeScript (src/types/index.ts)
```

## 📋 Checklist de Implementação

### ✅ Layout Geral
- [ ] Atualizar paleta de cores no tailwind.config.ts
- [ ] Criar ModernLayout component
- [ ] Implementar sidebar glassmorphism
- [ ] Adicionar responsividade mobile

### ✅ Componentes UI
- [ ] ModernInput component
- [ ] ModernButton component  
- [ ] ModernCard component
- [ ] ModernTable component
- [ ] Glassmorphism panels

### ✅ Páginas
- [ ] Dashboard com estatísticas visuais
- [ ] Pacientes com layout moderno
- [ ] Medicamentos com filtros visuais
- [ ] Receitas mantendo funcionalidade

### ✅ Animações
- [ ] Transições suaves entre páginas
- [ ] Hover effects em cards
- [ ] Loading states elegantes
- [ ] Micro-interações

## 🎯 Resultado Final Esperado

O sistema deve manter 100% da funcionalidade atual, mas com:
- **Visual moderno** com glassmorphism e gradientes
- **Navegação elegante** via sidebar
- **Responsividade completa** mobile/tablet/desktop
- **Animações suaves** e micro-interações
- **Consistência visual** em todos os componentes
- **Performance otimizada** sem quebrar funcionalidades existentes

## 📞 Suporte e Documentação

Para implementação no Lovable.dev:
1. **Implemente gradualmente** seguindo as fases
2. **Teste cada componente** antes de avançar
3. **Preserve todas as funcionalidades** existentes
4. **Use os componentes shadcn/ui** como base quando possível
5. **Mantenha a estrutura de tipos** TypeScript existente

---

**Versão**: 1.0  
**Data**: Agosto 2025  
**Projeto**: SISMED Perobal - Modernização UI/UX
