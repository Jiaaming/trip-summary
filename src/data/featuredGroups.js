export const featuredGroups = [
  {
    title: 'My "Theory of Everything" on How To Be Great',
    postId: 'how-to-be-great-101',
  },
  {
    title: 'Learnings from my software engineer career',
    children: [
      { title: 'AI Assisted System Design Interview Prep', postId: 'ai-assisted-system-design' },
      { title: 'Lessons Learned Building LLM Applications', postId: 'lessons-building-llm' },
      { title: 'Becoming a Staff Engineer', postId: 'becoming-staff-engineer' },
    ],
  },
  {
    title: 'Musings: shower thoughts on random subjects',
    postId: 'self-awareness-with-tools',
  },
  {
    title: 'Highlighted earlier posts in zh-CN',
    children: [
      { title: 'DIY 留学申请全攻略', postId: 'study-abroad-english' },
    ],
  },
]

export default featuredGroups
