<script setup>
import {
  ArticleLayout,
  ArticleHeader,
  ArticleText,
  ArticleDisclosure,
  ArticleCallout,
  ArticleFigure,
  ArticleSources,
} from '@/components/article'
import {
  Problem1Figure,
  SphereNormalizationFigure,
  InverseTrigSensitivityFigure,
  CosineLawVisualizer,
  AngleInvarianceVisualizer,
  HaversineVisualizer,
  ArcLengthVisualizer,
  GreatCircleVisualizer,
  FloatingPointVisualizer,
  FloatingPointDistribution,
} from '@/components/visualizations/spherical-cosine-law'

import { sources } from '@/data/article-sources/spherical-cosine-law.js'
import { articles } from '@/data/articles.js'

const article = articles.find(
  ({ slug }) => slug === 'spherical-cosine-law',
)
</script>

<template>
  <ArticleLayout>
    <ArticleHeader
      :title="article.title"
      :description="article.description"
      :date="article.date"
    />
    <ArticleText>
      실수는 누구나 피하고 싶은 것이다. 2017년 고등학교 시절, 쉬운 시험문제를 잘못 계산해서 틀렸다.
      처음 느낀 감정은 당혹스러움이었다. 당연히 맞았을 것이라 생각했던 예상이 빗나간 탓이다. 곧이어
      분함과 아쉬움이 몰려오고, 기억의 저편으로 사라졌다. 그것이 일반적인 실수의 퇴장이다. 그런데,
      인생에는 드물게 우연인지 필연인지 헷갈리는 경우가 있다. 문제 조건에 $30^{\circ}, 45^{\circ}$가
      있고, 문제의 답이 $\cos(\angle CAB)=\frac{\sqrt{6}}{4}$라면, $\cos(\angle
      CAB)=\cos(30^{\circ})\cos(45^{\circ})$이기 때문일거라는 추측이다.
    </ArticleText>
    <ArticleFigure caption="내 추측의 단서가 된 코사인 값들">
      <ArticleText>
        $$ \begin{array}{c|ccc} \theta & 30^\circ & 45^\circ & 60^\circ \\ \hline \sin\theta &
        \frac{1}{2} & \frac{\sqrt{2}}{2} & \frac{\sqrt{3}}{2} \\ \cos\theta &
        \textcolor{red}{\mathbf{\frac{\sqrt{3}}{2}}} & \textcolor{red}{\mathbf{\frac{\sqrt{2}}{2}}}
        & \frac{1}{2} \end{array} $$
      </ArticleText>
    </ArticleFigure>
    <ArticleCallout title="틀린 문제">
      네 점 $O, A, B, C$으로 이루어진 사면체가 있다. 점 $O$는 원점이고, 점 $A, B, C$는 $x, y, z$ 축
      위에 있다. $\angle OAB=45^{\circ}, \angle OAC=30^{\circ}$일 때, $\cos(\angle CAB)$을 구해라.
    </ArticleCallout>
    <ArticleFigure caption="틀린 문제의 사면체" width="content">
      <Problem1Figure />
    </ArticleFigure>
    <ArticleDisclosure title="틀린 문제 풀이">
      <ArticleText>
        편의상 $\overline{AO}=1$라고 하자. 직각삼각형 $\triangle OAB$에서 $\angle OAB=45^{\circ}$로
        주어져 있고, $\overline{AO}=1$로 가정했으니, 나머지 변들이 길이를 알 수 있다. 같은 원리로,
        직각삼각형 $\triangle OAC$의 나머지 변들도 길이를 구할 수 있다. $$
        \overline{AB}=\sqrt{2},\quad\overline{BO}=1,\quad\overline{AC}=\frac{2}{\sqrt{3}},\quad\overline{CO}=\frac{\sqrt{3}}{3}
        $$ $\triangle BOC$는 $\angle BOC=90^{\circ}$인 직각삼각형이니, 피타고라스 정리에 의해
        $\overline{BC}=\sqrt{\overline{BO}^2+\overline{CO}^2}=\frac{2}{\sqrt{3}}$이다. 마지막으로,
        $\triangle ABC$에서 제 2 코사인 법칙에 의해 정답인 $\cos(\angle CAB)$를 구할 수 있다. $$
        \cos(\angle
        CAB)=\frac{\overline{AB}^2+\overline{AC}^2-\overline{BC}^2}{2\times\overline{AB}\times\overline{AC}}=\frac{\sqrt{6}}{4}
        $$
      </ArticleText>
    </ArticleDisclosure>
    <ArticleText>
      나는 답이 $\frac{\sqrt{6}}{4}$으로 나온 것이 우연인지 참을 수 없이 궁금해졌다. 그래서, 면학 시간이 시작하자마자
      일반화를 했다.
    </ArticleText>
    <ArticleCallout title="일반화된 문제">
      네 점 $O, A, B, C$으로 이루어진 사면체가 있다. 점 $O$는 원점이고, 점 $A, B, C$는 $x, y, z$ 축
      위에 있다. $\angle OAB=\theta_1, \angle OAC=\theta_2$일 때, $\cos(\angle CAB)$을 구해라.
    </ArticleCallout>
    <ArticleDisclosure title="일반화된 문제 풀이">
      <ArticleText>
        편의상 $\overline{AO}=1$라고 하자. 직각삼각형 $\triangle OAB$에서 $\angle OAB=\theta_1$로
        주어져 있고, $\overline{AO}=1$로 가정했으니, 나머지 변들이 길이를 알 수 있다. 같은 원리로,
        직각삼각형 $\triangle OAC$의 나머지 변들도 길이를 구할 수 있다. $$
        \overline{AB}=\frac{1}{\cos{\theta_1}},\quad\overline{BO}=\tan(\theta_1),\quad\overline{AC}=\frac{1}{\cos(\theta_2)},\quad\overline{CO}=\tan(\theta_2)
        $$ $\triangle BOC$는 $\angle BOC=90^{\circ}$인 직각삼각형이니, 피타고라스 정리에 의해
        $\overline{BC}=\sqrt{\overline{BO}^2+\overline{CO}^2}=\sqrt{\tan(\theta_1)^2+\tan(\theta_2)^2}$이다.
        마지막으로, $\triangle ABC$에서 제 2 코사인 법칙에 의해 정답인 $\cos(\angle CAB)$를 구할 수
        있다. $$ \cos(\angle
        CAB)=\frac{\overline{AB}^2+\overline{AC}^2-\overline{BC}^2}{2\times\overline{AB}\times\overline{AC}}=\cos(\theta_1)\cos(\theta_2)
        $$
      </ArticleText>
    </ArticleDisclosure>
    <ArticleText>
      계산을 정리하면,
      $$ \cos(\angle CAB)=\cos(\theta_1)\cos(\theta_2) $$
      라는 관계를 얻는다. 처음 문제에서 보였던
      $\cos(30^\circ)\cos(45^\circ)$의 형태가 우연이 아니라는 것을 확인한 셈이다.
      금부스러기로 금맥을 발견하는 것처럼 나는 이 새로운 세계을 더 발굴하고 싶어졌다. 그래서, 숫자를 변수로 더 바꿔보았다.
    </ArticleText>
    <ArticleCallout title="더 일반화된 문제">
      네 점 $O, A, B, C$으로 이루어진 사면체가 있다. 점 $O$는 원점이고, 점 $B$는 $x=0$ 평면 위에, 점
      $A,C$는 $x,z$축 위에 있다. 두 삼각형 $\triangle OAB$, $\triangle OAC$가 이루는 각을
      $\theta_1$이라고 하자. $\angle OAB=\theta_2, \angle OAC=\theta_3$일 때, $\cos(\angle CAB)$을
      구해라.
    </ArticleCallout>
    <ArticleDisclosure title="더 일반화된 문제 풀이">
      <ArticleText>
        편의상 $\overline{AO}=1$라고 하자. 직각삼각형 $\triangle OAB$에서 $\angle OAB=\theta_2$로
        주어져 있고, $\overline{AO}=1$로 가정했으니, 나머지 변들이 길이를 알 수 있다. 같은 원리로,
        직각삼각형 $\triangle OAC$의 나머지 변들도 길이를 구할 수 있다. $$
        \overline{AB}=\frac{1}{\cos{\theta_2}},\quad\overline{BO}=\tan(\theta_2),\quad\overline{AC}=\frac{1}{\cos(\theta_3)},\quad\overline{CO}=\tan(\theta_3)
        $$ 먼저, $\triangle OBC$에서 제 2 코사인 법칙에 의해 다음이 성립한다. $$
        \overline{BC}^2=\overline{OB}^2+\overline{OC}^2-2\overline{OB}\times\overline{OC}\cos(\theta_1)
        $$ 마찬가지로, $\triangle ABC$에서 제 2 코사인 법칙에 의해 다음이 성립한다. $$
        \overline{BC}^2=\overline{AB}^2+\overline{AC}^2-2\overline{AB}\times\overline{AC}\cos(\angle
        CAB) $$ $\overline{BC}^2$에 대해 연립하여 정리하면 다음을 얻는다. $$ \cos(\angle
        CAB)=\cos(\theta_2)\cos(\theta_3)+\cos(\theta_1)\sin(\theta_2)\sin(\theta_3) $$
      </ArticleText>
    </ArticleDisclosure>
    <ArticleCallout title="Theorem. 구면 삼각형 코사인 법칙">
      내가 일반화를 통해 얻은 식은 이미 존재하는 공식이었다. 구면 위의 삼각형에서도 평면 삼각형의
      코사인 법칙과 비슷하게, 세 각과 세 변 사이의 관계를 나타내는 공식이 존재한다. 이를
      <strong>구면 삼각형 코사인 법칙</strong>이라고 한다. 내가 사용한 기호로 표현하면 다음과 같다.
      $$ \cos(\angle CAB) = \cos(\theta_2)\cos(\theta_3) +
      \sin(\theta_2)\sin(\theta_3)\cos(\theta_1) $$
    </ArticleCallout>
    <ArticleText>
      그 순간의 감정은 조금 묘했다. 한 문제의 계산 실수에서 시작한 의문이 이미 이름을 가진 수학적
      정리에 도달했다는 사실이 꽤 오래 기억에 남았다. 아래 도식화로 보면 이해하기 편하다. 사면체
      $OABC$에서 꼭짓점 $A$를 이루는 두 각($\theta_2,\theta_3$)과 그 사잇면이 이루는
      이면각($\theta_1$)을 알면 나머지 꼭짓점 $A$를 이루는 다른 각($\angle CAB$)을 알 수 있다는
      의미다.
    </ArticleText>
    <ArticleFigure caption="세 각에 따른 사면체의 각도 관계">
      <CosineLawVisualizer />
    </ArticleFigure>
    <ArticleText>
      한가지 놀라운 사실은 각 변 $\overline{AO}, \overline{AB}, \overline{AC}$의 길이가 변수로 쓰인
      모든 각도와 무관하다는 점이다. 아래 도식화에서 각 변의 길이를 바꾸더라도 변수로 쓰인 각도들은
      변하지 않는 것을 볼 수 있다. 공간벡터를 활용하여 이 공식을 유도하면 각 변의 길이와 무관하다는
      점을 수학적으로 보일 수 있다.
    </ArticleText>
    <ArticleDisclosure title="더 일반화된 문제: 공간벡터 활용 풀이">
      <ArticleText>
        이번에는 각 변의 길이를 고정하지 않고 공간좌표를 활용하여 같은 공식을 유도해보자. 편의상 점
        $A$를 원점으로 두고, $\overline{AO}$가 $x$축 위에 놓이도록 좌표계를 잡는다. 또한, $\triangle
        AOB$가 $xy$평면 위에 놓이도록 하자. $\overline{AB}=b, \overline{AC}=c$라고 하면, $\angle
        OAB=\theta_2$이므로 점 $B$의 좌표는 다음과 같이 나타낼 수 있다. $$ A=(0,0,0),\quad
        B=(b\cos(\theta_2),\ b\sin(\theta_2),\ 0) $$ 한편, $\angle OAC=\theta_3$이고 두 평면
        $\triangle AOB$, $\triangle AOC$가 이루는 이면각이 $\theta_1$이다. 따라서 점 $C$는 $x$축
        방향으로 $c\cos(\theta_3)$만큼, $x$축에 수직인 방향으로 $c\sin(\theta_3)$만큼 떨어져 있다.
        이 수직 성분이 $xy$평면과 $\theta_1$의 각을 이루므로 점 $C$의 좌표는 다음과 같이 나타낼 수
        있다. $$ C= \left( c\cos(\theta_3), \ c\sin(\theta_3)\cos(\theta_1), \
        c\sin(\theta_3)\sin(\theta_1) \right) $$ 이제 $\angle CAB$는 두 벡터 $\overrightarrow{AB}$와
        $\overrightarrow{AC}$가 이루는 각이므로, 두 벡터의 내적을 이용할 수 있다. $$
        \overrightarrow{AB}\cdot\overrightarrow{AC} =
        |\overrightarrow{AB}||\overrightarrow{AC}|\cos(\angle CAB) $$ 한편, 위에서 구한 좌표를
        이용하여 직접 내적하면 다음과 같다. $$ \overrightarrow{AB}\cdot\overrightarrow{AC} =
        bc\left( \cos(\theta_2)\cos(\theta_3) + \cos(\theta_1)\sin(\theta_2)\sin(\theta_3) \right)$$
        또한, $|\overrightarrow{AB}|=b,\ |\overrightarrow{AC}|=c$이므로 두 식을 비교하여 $bc$를
        약분하면 다음을 얻는다. $$ \cos(\angle CAB) = \cos(\theta_2)\cos(\theta_3) +
        \cos(\theta_1)\sin(\theta_2)\sin(\theta_3) $$ 이 과정에서 $\overline{AB}=b$,
        $\overline{AC}=c$라는 두 변의 길이는 최종적으로 모두 약분되어 사라진다. 따라서 $\angle
        CAB$는 각 변의 길이와 관계없이 $\theta_1,\theta_2,\theta_3$만으로 결정된다는 것을 알 수
        있다.
      </ArticleText>
    </ArticleDisclosure>
    <ArticleFigure caption="길이와 무관한 각도 관계">
      <AngleInvarianceVisualizer />
    </ArticleFigure>
    <ArticleText>
      공식이 각 변의 길이와 무관하다는 점을 이용하여, 지표면 상의 두 점 사이의 거리를 측정하는데
      사용할 수 있다. 둥근 지구 표면 위에서 두 점 사이를 가장 짧게 연결한 거리를 대권거리라고 한다.
    </ArticleText>
    <ArticleFigure caption="서울과 선택한 도시 사이의 대권거리">
      <GreatCircleVisualizer />
    </ArticleFigure>
    <ArticleText>
      원호의 길이($d$)는 그 원호의
      중심각($\theta$)과 원의 반지름($R$)에 비례한다. 따라서, 대권거리는 그 중심각과 지구의 반지름을
      이용해 구할 수 있다. $$ d=R\times\theta $$
      앞서 구면 삼각형 코사인 법칙으로 $\cos(\angle CAB) = \cos(\theta_2)\cos(\theta_3) +
      \sin(\theta_2)\sin(\theta_3)\cos(\theta_1)$임을 보였다. 대권거리를 구하는 문제에서는 $\angle
      CAB=\theta$이고, $\theta$에 대해 식을 정리하여 다음을 얻는다. $$
      \theta=\arccos(\cos(\theta_2)\cos(\theta_3) + \sin(\theta_2)\sin(\theta_3)\cos(\theta_1)) $$
    </ArticleText>
    <ArticleFigure caption="반지름과 중심각으로 결정되는 원호의 길이" width="content">
      <ArcLengthVisualizer />
    </ArticleFigure>
        <ArticleText>
      사면체를 점 $A$를 원점으로 평행이동하고 $\overline{AO}$이 북극 방향을 보도록 돌린 뒤 세 점을 같은 구면 위에
      올리면 다음과 같이 대권거리 문제의 구조가 된다.
    </ArticleText>
    <ArticleFigure caption="사면체에서 구면 위의 세 점으로" width="content">
      <SphereNormalizationFigure />
    </ArticleFigure>
    <ArticleText>
      이때 점 $A$는 지구의 중심, 점 $O$는 북극점에 대응하고, 나머지 두 점 $B,C$는 거리를 구하고 싶은
      지표면 위의 두 점 $P_1,P_2$에 대응한다.
    </ArticleText>
    <ArticleFigure caption="사면체 문제와 대권거리 문제의 변수 대응">
      <ArticleText>
        $$ \begin{array}{c|c|c} \text{사면체 문제} & \text{대권거리 문제} & \text{의미} \\ \hline A
        & \text{지구 중심} & \text{구의 중심} \\ O & \text{북극점} & \text{기준점} \\ B & P_1 &
        \text{첫 번째 지점} \\ C & P_2 & \text{두 번째 지점} \\ \hline \theta_1 &
        \Delta\lambda=\lambda_2-\lambda_1 & \text{경도 차이} \\ \theta_2 & \frac{\pi}{2}-\phi_1 &
        P_1\text{의 여위도} \\ \theta_3 & \frac{\pi}{2}-\phi_2 & P_2\text{의 여위도} \\ \angle CAB &
        \theta & \text{두 지점 사이의 중심각} \end{array} $$
      </ArticleText>
    </ArticleFigure>
    <ArticleText>
      보통 인터넷에 대권거리 계산을 검색하면 구면 삼각형 코사인 법칙이 나오진 않는다. 대신 하버사인
      공식이 나오는데, 그 이유는 컴퓨터가 계산할 때 오차가 더 적게 나오기 때문이다.
    </ArticleText>
    <ArticleCallout title="Theorem. 하버사인 공식">
      두 지점의 위도를 $\phi_1,\phi_2$, 경도 차이를
      $\Delta\lambda=\lambda_2-\lambda_1$, 두 지점 사이의 중심각을 $\theta$라고 하면
      다음 관계가 성립한다.

      $$ \sin^2\left(\frac{\theta}{2}\right)
      =
      \sin^2\left(\frac{\phi_2-\phi_1}{2}\right)
      +
      \cos(\phi_1)\cos(\phi_2)
      \sin^2\left(\frac{\Delta\lambda}{2}\right) $$

      오른쪽 값을 $a$라고 두면,

      $ \theta =
      2\arcsin\left(\sqrt{a}\right) $

      로 중심각을 구할 수 있고, 최종적으로 $d=R\theta$를 이용해 대권거리를 계산한다.
    </ArticleCallout>
    <ArticleDisclosure title="하버사인 공식 유도">
      <ArticleText>
        하버사인 공식은 구면 삼각형 코사인 법칙에서 간단히 유도할 수 있다. 먼저
        하버사인(haversine)은 놀랍게도 사람 이름이 아니라, 다음과 같이 정의되는 삼각함수의 이름이다.
        $$ \operatorname{hav}(\alpha) = \sin^2\left(\frac{\alpha}{2}\right) =
        \frac{1-\cos(\alpha)}{2} $$ 따라서 다음 관계가 성립한다. $$
        \cos(\alpha)=1-2\operatorname{hav}(\alpha) $$ 앞서 구한 두 지점 사이의 중심각을 $\theta$, 두
        지점의 위도를 $\phi_1,\phi_2$, 경도 차이를 $\Delta\lambda$라고 하면 구면 삼각형 코사인
        법칙은 다음과 같다. $$ \cos(\theta) = \sin(\phi_1)\sin(\phi_2) +
        \cos(\phi_1)\cos(\phi_2)\cos(\Delta\lambda) $$ 양변을 $1-\cos(\theta)$의 형태로 바꾸고,
        $\cos(\phi_1)\cos(\phi_2)$를 더하고 빼서 묶어보자. $$ \begin{aligned} 1-\cos(\theta) &=
        1-\sin(\phi_1)\sin(\phi_2) -\cos(\phi_1)\cos(\phi_2)\cos(\Delta\lambda) \\[4pt] &=
        1-\sin(\phi_1)\sin(\phi_2) -\cos(\phi_1)\cos(\phi_2) \\ &\quad +\cos(\phi_1)\cos(\phi_2)
        \left(1-\cos(\Delta\lambda)\right) \end{aligned} $$ 여기서 삼각함수의 차 공식 $$
        \cos(a-b)=\cos(a)\cos(b)+\sin(a)\sin(b) $$ 을 사용하면 앞부분을 다음과 같이 묶을 수 있다. $$
        1-\sin(\phi_1)\sin(\phi_2)-\cos(\phi_1)\cos(\phi_2) = 1-\cos(\phi_1-\phi_2) $$ 따라서, $$
        1-\cos(\theta) = 1-\cos(\phi_1-\phi_2) + \cos(\phi_1)\cos(\phi_2)
        \left(1-\cos(\Delta\lambda)\right) $$ 이제 $1-\cos(\alpha)=2\operatorname{hav}(\alpha)$를
        적용하고 양변을 2로 나누면, $$ \operatorname{hav}(\theta) =
        \operatorname{hav}(\phi_2-\phi_1) + \cos(\phi_1)\cos(\phi_2)
        \operatorname{hav}(\Delta\lambda) $$ 를 얻는다. 이것이 하버사인 공식의 핵심 형태다.
        하버사인의 정의를 다시 대입하면 우리가 흔히 보는 형태가 된다. $$
        \sin^2\left(\frac{\theta}{2}\right) = \sin^2\left(\frac{\phi_2-\phi_1}{2}\right) +
        \cos(\phi_1)\cos(\phi_2) \sin^2\left(\frac{\Delta\lambda}{2}\right) $$ 계산을 간단히 쓰기
        위해 다음과 같이 두자. $$ a = \operatorname{hav}(\theta) =
        \sin^2\left(\frac{\phi_2-\phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)
        \sin^2\left(\frac{\Delta\lambda}{2}\right) $$ 그러면 $a=\sin^2(\theta/2)$이므로 중심각
        $\theta$는 다음과 같이 복원할 수 있다. $$ \theta=2\arcsin(\sqrt{a}) $$ 같은 관계를 탄젠트를
        이용해 표현하면 다음과 같다. $$ \tan\left(\frac{\theta}{2}\right)=
        \frac{\sqrt{a}}{\sqrt{1-a}} $$ 따라서, $$ \theta = 2\arctan\left(
        \frac{\sqrt{a}}{\sqrt{1-a}} \right) $$ 로도 계산할 수 있다. 실제 구현에서는 0으로 나누는
        문제를 피하기 위해 같은 식을 다음과 같이 $\operatorname{atan2}$ 형태로 쓰는 경우가 많다. $$
        \theta = 2\operatorname{atan2} \left( \sqrt{a}, \sqrt{1-a} \right) $$ 어떤 형태를
        사용하더라도 마지막에는 $d=R\theta$를 이용해 대권거리를 구한다.
      </ArticleText>
    </ArticleDisclosure>
    <ArticleText>
      구면삼각형 코사인 법칙과 하버사인 공식은 수학적으로 같은 대권거리를 계산하지만, 컴퓨터에서 계산하면 서로 다른 수치 오차가 발생할 수 있다. 
      두 지점이 매우 가까우면 중심각 $\theta$는 0에 가까워지고, 이에 따라 $\cos\theta$는 1에, $\sin\theta$는 0에 가까워진다. 
      따라서 중심각을 다시 구하는 과정에서 코사인 기반 계산은 $\arccos$의 $x=1$ 부근을, 사인 기반 계산은 $\arcsin$의 $x=0$ 부근을 사용하게 된다.

      문제는 두 역함수의 이 구간에서의 민감도가 다르다는 점이다.  
      아래 도식은 두 그래프에 같은 크기의 입력 변화량 $\Delta x$를 주었을 때 출력 변화량 $\Delta y$가 얼마나 달라지는지를 비교한다.
      $\arccos$는 $x=1$ 부근에서 같은 $\Delta x$에 대해 더 큰 $\Delta y$를 만드는 반면, $\arcsin$은 $x=0$ 부근에서 $\Delta y$가 비교적 일정하게 감소한다. 
      즉, 같은 크기의 입력 오차가 발생하더라도 $\arccos$를 이용한 계산에서는 그 오차가 출력값에 더 크게 반영될 수 있다.
    </ArticleText>

    <ArticleDisclosure title="역삼각함수 기울기 유도">
      <ArticleText>
        역함수가 존재하는 일대일 대응 함수에서 역함수에 원래함수를 취하면 함수의 변수가 나온다.
        $$
        y=\arcsin(x),\quad\sin(y)=\sin(\arcsin(x)),\quad\sin(y)=x
        $$
        그 다음 양변을 $x$에 대해 미분하면 다음을 얻는다.
        $$
        \cos(y)\frac{dy}{dx}=1,\quad\frac{dy}{dx}=\frac{1}{\cos(y)}
        $$
        이 때, $\sin^2(x)+\cos^2(x)=1$인 점을 이용하여 $\arcsin$의 도함수를 구할 수 있다.
        $$
        \frac{dy}{dx}=\frac{1}{\sqrt{1-\sin^2(y)}}=\frac{1}{\sqrt{1-x^2}}
        $$
        같은 방법으로 $\arccos$의 도함수는 다음과 같다.
        $$
        \frac{dy}{dx}=-\frac{1}{\sqrt{1-x^2}}
        $$
        따라서, 다음과 같이 기울기를 구할 수 있다.
        $$
        \frac{d}{dx}\arccos x=-\frac{1}{\sqrt{1-x^2}},\quad\lim_{x\to1^-}\frac{d}{dx}\arccos x=-\infty
        $$

        $$
        \frac{d}{dx}\arcsin x=\frac{1}{\sqrt{1-x^2}},\quad\left.\frac{d}{dx}\arcsin x\right|_{x=0}=1
        $$
        $\arccos$는 $x=1$에 가까워질수록 기울기의 절댓값이 급격히 커지는 반면, $\arcsin$은 $x=0$ 부근에서 기울기가 1에 가깝다.
        따라서, $\arccos$은 $x=1$ 부근에서 오차에 민감하고, $\arcsin$은 $x=0$ 부근에서 오차에 둔감하다.
      </ArticleText>
    </ArticleDisclosure>


    <ArticleFigure caption="역삼각함수의 기울기와 수치적 민감도" width="content">
      <InverseTrigSensitivityFigure />
    </ArticleFigure>

    <ArticleText>
      아래 도식에서는 두 지점 사이의 거리가 매우 가까워질수록 $\arccos$를 사용하는 구면삼각형 코사인 법칙과 $\arcsin$을 사용하는 하버사인 공식의 대권거리 계산값이 서로 다르게 나타나는 것을 확인할 수 있다. 
      이러한 차이는 실제 컴퓨터 연산에서 두 공식으로 계산한 대권거리의 오차 차이로 이어질 수 있다.
    </ArticleText>

    <ArticleFigure caption="지표면 상의 두 점 사이의 거리">
      <HaversineVisualizer />
    </ArticleFigure>

    <ArticleText>
      대부분 사람들은 컴퓨터가 정확해서 오차가 발생한다고 믿지 않거나, 무시할 수 있는 수준이라고 생각한다.
      그러나, 컴퓨터가 실수를 표현하는 부동소수점 형식인 IEEE 754는 수학에서 말하는 실수와 다른 대상이다.
      내가 처음 부동소수점을 접한 곳은 화학이었다. 원자, 분자, 이온의 수를 세는 단위인 몰(mol)에 대해 배우며, 1몰은 $6.02214076\times10^{23}$개의 입자라고 외운 기억이 난다.
      처음엔 겉멋이라 생각했는데, 1몰을 그대로 $602214076000000000000000$로 적어보면 왜 이런 표기를 쓰는지 이해가 바로 되었다.
      반대로 부동소수점 형식은 아주 작은 수도 간결하게 표현할 수 있다. 수소 원자의 질량은 $1.67\times 10^{-24}$g인데, 이를 그대로 적으면 $0.00000000000000000000000167$g이다.
      이렇듯 아주 작은 수와 아주 큰 수를 동시에 표현할 수 있는 형식이 바로 부동소수점인 것이다.
    </ArticleText>

    <ArticleCallout title="Definition. 부동소수점">
      부동소수점(浮動小數點)은 한 실수 $x$를 유효숫자와 지수로 나누어 표현하는 방식이다.
      여기서 '부동(浮動)'의 '부(浮)'는 '아닐 부(不)'가 아니라 '뜰 부(浮)', 즉 물에 떠서 움직인다는 뜻의 한자이다. 소수점의 위치가 지수에 따라 떠다니듯 움직인다는 의미에서 floating point를 '부동소수점'이라고 부른다.

      $$
      x = \pm m \times b^e
      $$

      여기서 $m$은 유효숫자(significand), $b$는 밑(base), $e$는 지수(exponent)이다.

      같은 유효숫자를 사용하더라도 지수 $e$를 바꾸면 소수점의 위치가 이동하므로, 매우 크거나 매우 작은 수를 동일한 형식으로 표현할 수 있다.
    </ArticleCallout>

    <ArticleText>
      컴퓨터에서는 밑으로 $2$를 사용하므로, 이진 부동소수점은 다음과 같은 형태를 갖는다.

      $$
      x = (-1)^s \times m \times 2^e
      $$

      여기서 $s$는 부호를 나타내고, $m$과 $e$는 모두 컴퓨터가 표현할 수 있는 이진수이다.
      IEEE 754 표준에서는 하나의 부동소수점을 부호(Sign), 지수(Exponent), 가수부(Fraction)의 세 영역으로 나누어 저장한다. 대표적으로 32비트 단정밀도(single precision)는 부호에 1비트, 지수에 8비트, 가수부에 23비트를 사용한다.

      $$
      \underbrace{s}_{1\text{ bit}}
      \quad
      \underbrace{eeeeeeee}_{8\text{ bits}}
      \quad
      \underbrace{fffffffffffffffffffffff}_{23\text{ bits}}
      $$

      64비트 배정밀도(double precision)에서는 같은 구조를 사용하되 지수에 11비트, 가수부에 52비트를 사용한다. 비트 수가 많아질수록 더 넓은 범위와 높은 정밀도로 수를 표현할 수 있다.

      아래 시각화에서는 이러한 구조를 한눈에 살펴볼 수 있도록 실제 IEEE 754 단정밀도보다 해상도를 낮춘 부동소수점 형식을 사용했다. 부호는 동일하게 1비트를 사용하고, 지수는 4비트, 가수부는 5비트로 줄였다.
    </ArticleText>

    <ArticleFigure caption="이진 부동소수점의 비트 표현" width="content">
      <FloatingPointVisualizer />
    </ArticleFigure>

    <ArticleText>
      눈썰미가 좋은 사람이라면, 0에서 멀어질수록 표현가능한 수의 간격이 커진다는 점을 알 수 있다.
      따라서 $x=1$ 부근을 사용하는 $\arccos$기반 구면삼각형 코사인 법칙은 $x=0$ 부근을 사용하는 $\arcsin$기반 하버사인 공식보다 큰 입력값 오차가 생길 가능성이 크다.
    </ArticleText>

    <ArticleFigure caption="이진 부동소수점의 분포" width="content">
      <FloatingPointDistribution/>
    </ArticleFigure>

    <ArticleSources :sources="sources" />
  </ArticleLayout>
</template>
