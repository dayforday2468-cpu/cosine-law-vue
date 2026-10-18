export const sources = [
  {
    title: '러닝 GPS 데이터',
    contribution:
      '러닝 중 기록한 GPS 트랙을 GPX로 내보내 경로 시각화의 원천 데이터로 사용했습니다.',
    source: 'Strava',
    links: [
      {
        label: 'Strava',
        url: 'https://www.strava.com/',
      },
    ],
  },
  {
    title: '러닝 경로 지도 시각화',
    contribution:
      '러닝 경로와 시작·종료 지점, 사진 촬영 위치를 지도 위에 시각화하는 데 사용했습니다.',
    source: 'Kakao Maps JavaScript API',
    links: [
      {
        label: '공식 문서',
        url: 'https://apis.map.kakao.com/web/documentation/',
      },
    ],
  },
  {
    title: '사진 미디어 제공',
    contribution:
      '지도와 본문에 사용한 사진을 저장하고 웹에서 제공하는 데 사용했습니다.',
    source: 'Amazon S3 / Amazon CloudFront',
    links: [
      {
        label: 'Amazon S3',
        url: 'https://aws.amazon.com/s3/',
      },
      {
        label: 'Amazon CloudFront',
        url: 'https://aws.amazon.com/cloudfront/',
      },
    ],
  },
]
