import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  animationDelay: number;
}

export const StarField = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 50;

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small',
          animationDelay: Math.random() * 3,
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star star-${star.size} float-${(star.id % 3) + 1}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}
      
      {/* Decorative space elements */}
      <div 
        className="absolute w-16 h-16 opacity-20 float-1"
        style={{ 
          left: '15%', 
          top: '20%',
          background: 'linear-gradient(45deg, #6366f1, #3b82f6)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        }}
      />
      <div 
        className="absolute w-12 h-12 opacity-15 float-2"
        style={{ 
          right: '20%', 
          top: '60%',
          background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
          borderRadius: '50%',
        }}
      />
      <div 
        className="absolute w-8 h-20 opacity-10 float-3"
        style={{ 
          left: '80%', 
          bottom: '20%',
          background: 'linear-gradient(90deg, #6366f1 0%, transparent 100%)',
          borderRadius: '50px',
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
};