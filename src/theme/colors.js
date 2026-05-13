export const Colors = {
  // Primary Palette 
  primary: '#0A0E27',       
  primaryLight: '#141836',  
  primaryCard: '#1C2040',    

  // Accent Colors 
  accent: '#00D4FF',         
  accentSecondary: '#7B61FF',
  accentGlow: 'rgba(0, 212, 255, 0.15)', 

  // Text Colors 
  textPrimary: '#FFFFFF',    
  textSecondary: '#8892B0',  
  textMuted: '#4A5568',      

  // UI Utility Colors 
  border: 'rgba(0, 212, 255, 0.12)',  
  divider: 'rgba(255,255,255,0.06)',   
  overlay: 'rgba(10, 14, 39, 0.85)',  

  // Status Colors
  success: '#00C896',
  error: '#FF4757',
};

// Gradient Definitions
export const Gradients = {
  background: [Colors.primary, '#0D1128'],       
  card: [Colors.primaryLight, Colors.primaryCard],
  accent: ['#00D4FF', '#7B61FF'],               
  header: ['#0A0E27', '#141836'],                
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography 
export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999, 
};