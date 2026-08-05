<script setup>
import ArticleLayout from '@/components/article/ArticleLayout.vue'
import ArticleHeader from '@/components/article/ArticleHeader.vue'
import ArticleText from '@/components/article/ArticleText.vue'
import ArticleDisclosure from '@/components/article/ArticleDisclosure.vue';
import ProblemCard from '@/components/article/ProblemCard.vue';
import {
  CosineLawVisualizer,
  AngleInvarianceVisualizer,
  HaversineVisualizer,
} from '@/components/visualizations'
</script>

<template>
  <ArticleLayout>
    <ArticleHeader
      title="6년 묵은 오답노트, 커리어의 핵심이 되다."
      description="계산 실수로 발견한 구면 삼각형 코사인 법칙이 이끈 나의 커리어 이야기"
      date="2026-08-05"
    />
    <ArticleText>
      실수는 누구나 피하고 싶은 것이다. 고등학교 시절, 쉬운 시험문제를 잘못 계산해서 틀렸다.
      처음 느낀 감정은 당혹스러움이었다. 당연히 맞았을 것이라 생각했던 예상이 빗나간 탓이다.
      곧이어 분함과 아쉬움이 몰려오고, 이내 기억의 저편으로 사라진다. 그것이 일반적인 실수의 퇴장이다.
      그런데, 인생에는 드물게 우연인지 필연인지 헷갈리는 경우가 있다.
      "까마귀가 날면 배가 떨어지는 건가?"처럼 무의식의 난입이 일어날 때가 있다.
      문제 조건에 $30^{\circ}, 45^{\circ}$가 있고, 답이 $\frac{\sqrt{6}}{4}$라면, $\cos(30^{\circ})\cos(45^{\circ})=\frac{\sqrt{6}}{4}$이기 때문일거라는 망상이다.
      불행히도, 틀린 문제가 100점 만점에 10점인 쉬운 문제였으니 어이없는 생각이 나무에 못이 박히듯 떠나가질 않았다.
    </ArticleText>
    <ProblemCard>
      네 점 $O, A, B, C$으로 이루어진 사면체가 있다. 점 $O$는 원점이고, 점 $A, B, C$는 $x, y, z$ 축 위에 있다.
      $\angle OAB=45^{\circ}, \angle OAC=30^{\circ}$일 때, $\cos(\angle CAB)$을 구해라.
    </ProblemCard>
    <ArticleDisclosure title="틀린 문제 풀이">
      <ArticleText>
        편의상 $\overline{AO}=1$라고 하자. 직각삼각형 $\triangle OAB$에서 $\angle OAB=45^{\circ}$로 주어져 있고, $\overline{AO}=1$로 가정했으니, 나머지 변들이 길이를 알 수 있다.
        같은 원리로, 직각삼각형 $\triangle OAC$의 나머지 변들도 길이를 구할 수 있다. 
        $$
        \overline{AB}=\sqrt{2},\quad\overline{BO}=1,\quad\overline{AC}=\frac{2}{\sqrt{3}},\quad\overline{CO}=\frac{\sqrt{3}}{3}
        $$
        $\triangle BOC$는 $\angle BOC=90^{\circ}$인 직각삼각형이니, 피타고라스 정리에 의해 $\overline{BC}=\sqrt{\overline{BO}^2+\overline{CO}^2}=\frac{2}{\sqrt{3}}$이다.
        마지막으로, $\triangle ABC$에서 제 2 코사인 법칙에 의해 정답인 $\cos(\angle CAB)$를 구할 수 있다.
        $$
        \cos(\angle CAB)=\frac{\overline{AB}^2+\overline{AC}^2-\overline{BC}^2}{2\times\overline{AB}\times\overline{AC}}=\frac{\sqrt{6}}{4}
        $$
      </ArticleText>
    </ArticleDisclosure>
    <ArticleText>
      나는 참을 수 없이 궁금해졌다. 이 결과가 우연인지. 그래서, 면학 시간이 시작하자마자 일반화를 했다.
    </ArticleText>
    <ProblemCard>
      네 점 $O, A, B, C$으로 이루어진 사면체가 있다. 점 $O$는 원점이고, 점 $A, B, C$는 $x, y, z$ 축 위에 있다.
      $\angle OAB=\theta_1, \angle OAC=\theta_2$일 때, $\cos(\angle CAB)$을 구해라.
    </ProblemCard>
    <ArticleDisclosure title="일반화된 문제 풀이">
      <ArticleText>
        편의상 $\overline{AO}=1$라고 하자. 직각삼각형 $\triangle OAB$에서 $\angle OAB=\theta_1$로 주어져 있고, $\overline{AO}=1$로 가정했으니, 나머지 변들이 길이를 알 수 있다.
        같은 원리로, 직각삼각형 $\triangle OAC$의 나머지 변들도 길이를 구할 수 있다. 
        $$
        \overline{AB}=\frac{1}{\cos{\theta_1}},\quad\overline{BO}=\tan(\theta_1),\quad\overline{AC}=\frac{1}{\cos(\theta_2)},\quad\overline{CO}=\tan(\theta_2)
        $$
        $\triangle BOC$는 $\angle BOC=90^{\circ}$인 직각삼각형이니, 피타고라스 정리에 의해 $\overline{BC}=\sqrt{\overline{BO}^2+\overline{CO}^2}=\sqrt{\tan(\theta_1)^2+\tan(\theta_2)^2}$이다.
        마지막으로, $\triangle ABC$에서 제 2 코사인 법칙에 의해 정답인 $\cos(\angle CAB)$를 구할 수 있다.
        $$
        \cos(\angle CAB)=\frac{\overline{AB}^2+\overline{AC}^2-\overline{BC}^2}{2\times\overline{AB}\times\overline{AC}}=\cos(\theta_1)\cos(\theta_2)
        $$        
      </ArticleText>
    </ArticleDisclosure>
    <ArticleText>
      믿음반, 의심반이었던 내 추측은 이제 사실이 되었다. 어쩌면 여기서 해피엔딩으로 끝날 수도 있었다. 흔한 일반화나, 공식 유도였다고. 
      그러나, 여기서 한 번 더 일반화가 될 것 같다는 논리적으로 설명할 수 없는 마음의 소리가 있었다.
      변수가 4개나 있기 때문에 잘 정리된 공식은 없을 것 같다고 생각하면서도 멈추진 않았다.
    </ArticleText>
    <ProblemCard>
      네 점 $O, A, B, C$으로 이루어진 사면체가 있다. 점 $O$는 원점이고, 점 $A,C$는 $x,z$축 위에 있다.
      두 삼각형 $\triangle OAB$, $\triangle OAC$가 이루는 각을 $\theta_1$이라고 하자.
      $\angle OAB=\theta_2, \angle OAC=\theta_3$일 때, $\cos(\angle CAB)$을 구해라.
    </ProblemCard>
    <ArticleDisclosure title="더 일반화된 문제 풀이">
      <ArticleText>
        편의상 $\overline{AO}=1$라고 하자. 직각삼각형 $\triangle OAB$에서 $\angle OAB=\theta_2$로 주어져 있고, $\overline{AO}=1$로 가정했으니, 나머지 변들이 길이를 알 수 있다.
        같은 원리로, 직각삼각형 $\triangle OAC$의 나머지 변들도 길이를 구할 수 있다.
        $$
        \overline{AB}=\frac{1}{\cos{\theta_2}},\quad\overline{BO}=\tan(\theta_2),\quad\overline{AC}=\frac{1}{\cos(\theta_3)},\quad\overline{CO}=\tan(\theta_3)
        $$
        먼저, $\triangle OBC$에서 제 2 코사인 법칙에 의해 다음이 성립한다.
        $$
        \overline{BC}^2=\overline{OB}^2+\overline{OC}^2-2\overline{OB}\times\overline{OC}\cos(\theta_1)
        $$
        마찬가지로, $\triangle ABC$에서 제 2 코사인 법칙에 의해 다음이 성립한다.
        $$
        \overline{BC}^2=\overline{AB}^2+\overline{AC}^2-2\overline{AB}\times\overline{AC}\cos(\angle CAB)
        $$
        $\overline{BC}^2$에 대해 연립하여 정리하면 다음을 얻는다.
        $$
        \cos(\angle CAB)=\cos(\theta_2)\cos(\theta_3)+\cos(\theta_1)\sin(\theta_2)\sin(\theta_3)
        $$
      </ArticleText>
    </ArticleDisclosure>
    <ArticleText>
      
    </ArticleText>
    <CosineLawVisualizer />
    <AngleInvarianceVisualizer />
    <p>테스트용 본문입니다.</p>
    <HaversineVisualizer />
  </ArticleLayout>
</template>
