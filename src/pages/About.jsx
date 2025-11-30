import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import FeaturedList from '../components/FeaturedList'
import { featuredGroups } from '../data/featuredGroups'
import aboutContent from '../content/about.md?raw'

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-ink">{children}</h2>
)

const About = () => (
  <div className="p-1 sm:p-2 space-y-6">
    <div className="flex flex-col items-start">
      <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-white">
        <img
          src="avatar.jpg"
          alt="头像"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="markdown text-base leading-7">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {aboutContent}
        </ReactMarkdown>
      </div>
    </div>
  </div>
)

export default About
