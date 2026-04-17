'use client';

interface CampImageDirectProps {
  images: string[];
  title: string;
}

export default function CampImageDirect({ images, title }: CampImageDirectProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-400 text-sm">아직 등록된 사진이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {images.map((imageSrc, index) => (
        <div key={index} className="w-full max-w-4xl mx-auto">
          <div 
            className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(imageSrc, '_blank')}
          >
            <img 
              src={imageSrc}
              alt={`${title} 이미지 ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ))}
    </div>
  );
}