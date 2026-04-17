'use client';

export default function ImageTest() {
  return (
    <div className="p-4 border-2 border-red-500">
      <h3>이미지 테스트</h3>
      
      {/* 테스트 1: 절대 경로 */}
      <div className="mb-4">
        <h4>테스트 1: 절대 경로</h4>
        <img 
          src="/images/camps/je/overview/1.png" 
          alt="테스트 1" 
          style={{ width: '300px', height: 'auto', border: '2px solid blue' }}
          onLoad={() => console.log('테스트 1 로드 성공')}
          onError={(e) => console.error('테스트 1 실패', e)}
        />
      </div>
      
      {/* 테스트 2: aspect-video 컨테이너 */}
      <div className="mb-4">
        <h4>테스트 2: aspect-video 컨테이너</h4>
        <div className="aspect-video w-80 bg-yellow-200 border-2 border-green-500">
          <img 
            src="/images/camps/je/overview/1.png" 
            alt="테스트 2" 
            className="w-full h-full object-cover"
            onLoad={() => console.log('테스트 2 로드 성공')}
            onError={(e) => console.error('테스트 2 실패', e)}
          />
        </div>
      </div>
      
      {/* 테스트 3: 원본 컴포넌트와 동일한 구조 */}
      <div className="mb-4">
        <h4>테스트 3: 원본과 동일한 구조</h4>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 w-80 border-2 border-purple-500">
          <img
            src="/images/camps/je/overview/1.png"
            alt="테스트 3"
            className="w-full h-full object-cover"
            onLoad={() => console.log('테스트 3 로드 성공')}
            onError={(e) => console.error('테스트 3 실패', e)}
          />
        </div>
      </div>
    </div>
  );
}