const LOGO_URL = 'https://media.base44.com/images/public/6a51082b02e209c4da4a908c/71e9e0022_generated_image.png';

export default function Logo({ className = '', showWord = true, size = 'md' }) {
  const imgSize = size === 'lg' ? 'h-12 md:h-14' : size === 'sm' ? 'h-7' : 'h-9';
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={LOGO_URL} alt="RAIJIN E-MOTO 雷神 logo" className={`${imgSize} w-auto object-contain`} />
      {showWord && (
        <div className="leading-none">
          <div className="font-display font-bold text-base md:text-lg tracking-wider text-white">RAIJIN<span className="text-primary"> E-MOTO</span></div>
          <div className="font-display text-[9px] md:text-[10px] tracking-[0.3em] text-muted-foreground">雷神 · THUNDER GOD</div>
        </div>
      )}
    </div>
  );
}