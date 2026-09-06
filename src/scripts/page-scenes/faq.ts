import { kit, colors, smooth, mix } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.3);
  const question = k.path('three-dimensional-question', [[-0.55, 2.7, 0], [-0.6, 3.15, 0], [0, 3.45, 0], [0.62, 3.05, 0], [0.38, 2.55, 0], [0, 2.3, 0], [0, 2.05, 0]], colors.orange, 0.17).object;
  const dot = k.orb('question-dot', colors.orange, 0.18); dot.position.y = 1.53;
  const answers = [0, 1, 2].map(i => {
    const answer = k.paper('unfolding-answer-' + i, 2.8, 0.85);
    answer.position.set(0, 0.15 + i * 0.1, 0.65 + i * 0.03);
    return answer;
  });
  return { root: k.root, update(p: number, t: number) {
    answers.forEach((answer, i) => {
      const unfold = smooth(i * 0.14, 0.6 + i * 0.14, p * 0.8 + smooth(0, 2, t) * 0.2);
      answer.position.set(mix((i - 1) * 0.1, (i - 1) * 1.1, unfold), 0.14 + i * 0.1 + unfold * 0.2, 0.5 + unfold * 0.75);
      answer.rotation.set(mix(-0.9, -0.22, unfold), (i - 1) * unfold * 0.23, 0);
    });
    question.rotation.y = Math.sin(t * 0.32) * 0.12;
    dot.position.y = 1.53 + Math.sin(t * 0.8) * 0.035;
    k.root.rotation.y = -0.25 + p * 0.4;
  } };
}
