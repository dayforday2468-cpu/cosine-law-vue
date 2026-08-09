<script setup>
import {
  ArticleLayout,
  ArticleHeader,
  ArticleText,
  ArticleDisclosure,
  ArticleCallout,
  ArticleFigure,
} from '@/components/article'
import {
  CosineLawVisualizer,
  AngleInvarianceVisualizer,
  HaversineVisualizer,
  ArcLengthVisualizer,
} from '@/components/visualizations'
</script>

<template>
  <ArticleLayout>
    <ArticleHeader
      title="계산 실수로 발견한 구면삼각형 코사인 법칙"
      description="6년 묵은 오답노트, 커리어의 핵심이 되다."
      date="2026-08-05"
    />
    <ArticleText>
      실수는 누구나 피하고 싶은 것이다. 2017년 고등학교 시절, 쉬운 시험문제를 잘못 계산해서 틀렸다.
      처음 느낀 감정은 당혹스러움이었다. 당연히 맞았을 것이라 생각했던 예상이 빗나간 탓이다. 곧이어
      분함과 아쉬움이 몰려오고, 기억의 저편으로 사라졌다. 그것이 일반적인 실수의 퇴장이다. 그런데,
      인생에는 드물게 우연인지 필연인지 헷갈리는 경우가 있다. 문제 조건에 $30^{\circ}, 45^{\circ}$가
      있고, 문제의 답이 $\cos(\angle CAB)=\frac{\sqrt{6}}{4}$라면, $\cos(\angle
      CAB)=\cos(30^{\circ})\cos(45^{\circ})$이기 때문일거라는 추측이다. 불행히도, 틀린 문제가 100점
      만점에 10점인 쉬운 문제였으니 어이없는 생각이 나무에 못이 박히듯 떠나가질 않았다.
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
      나는 답이 이렇게 나온게 우연인지 참을 수 없이 궁금해졌다. 그래서, 면학 시간이 시작하자마자
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
      두 각의 값을 바꿔도 비슷한 관계가 유지되는지 확인하기 위해 문제의 숫자를 변수로 바꿨다. 처음
      발견한 패턴은 우연이 아니었다. 금부스러기로 금맥을 발견하는 것처럼 나는 이 새로운 세계을 더
      발굴하고 싶어졌다. 그래서, 숫자를 변수로 더 바꿔보았다.
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
      점 $A$를 지구의 중심, 점 $O$를 북극점에 놓고, 나머지 두 점 $B,C$를 거리를 구하고 싶은 지표면
      상의 두 점 $P_1,P_2$에 두면, 문제 상황과 그대로 일치한다. 원호의 길이($d$)는 그 원호의
      중심각($\theta$)과 원의 반지름($R$)에 비례한다. 따라서, 대권거리는 그 중심각과 지구의 반지름을
      이용해 구할 수 있다. $$ d=R\times\theta $$
    </ArticleText>
    <ArticleDisclosure title="원호 공식 시각화">
      <ArticleFigure caption="반지름과 중심각으로 결정되는 원호의 길이">
        <ArcLengthVisualizer />
      </ArticleFigure>
    </ArticleDisclosure>
    <ArticleText>
      앞서 구면 삼각형 코사인 법칙으로 $\cos(\angle CAB) = \cos(\theta_2)\cos(\theta_3) +
      \sin(\theta_2)\sin(\theta_3)\cos(\theta_1)$임을 보였다. 대권거리를 구하는 문제에서는 $\angle
      CAB=\theta$이고, $\theta$에 대해 식을 정리하여 다음을 얻는다. $$
      \theta=\arccos(\cos(\theta_2)\cos(\theta_3) + \sin(\theta_2)\sin(\theta_3)\cos(\theta_1)) $$
      $\theta_1$, $\theta_2$, $\theta_3$는 사면체 문제에서 쓴 변수고, 이를 대권거리 계산하는
      문제에서 쓰는 변수로 대응시키면 다음과 같다.
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
      공식이라는 나오는데, 그 이유는 컴퓨터가 계산할 떄 오차가 더 적게 나오기 때문이다.
    </ArticleText>
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
    <ArticleFigure caption="지표면 상의 두 점 사이의 거리">
      <HaversineVisualizer />
    </ArticleFigure>
    <ArticleText>
      구면 삼각형 코사인 법칙과 하버사인 공식은 수학적으로 같은 대권거리를 계산하지만,
      컴퓨터로 계산할 때는 차이가 생길 수 있다. 두 지점이 매우 가까우면 중심각 $\theta$가 작아져
      $\cos(\theta)$가 1에 매우 가까워진다. 구면 삼각형 코사인 법칙은 이 값에 다시
      $\arccos$를 적용해야 하므로, 부동소수점 계산 과정에서 작은 차이를 잃을 수 있다.

      반면 하버사인 공식은 $\sin^2(\theta/2)$처럼 작은 각을 직접 0에 가까운 작은 값으로 표현하기 때문에
      가까운 두 지점의 거리를 계산할 때 수치적으로 더 안정적이다. 
    </ArticleText>
  </ArticleLayout>
</template>
