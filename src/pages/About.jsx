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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ children, ...props }) => {
              // 让所有链接在新标签页打开
              return (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            },
            ul: ({ children }) => {
              return <ul className="list-disc list-outside ml-6 space-y-2">{children}</ul>
            },
            ol: ({ children }) => {
              return <ol className="list-decimal list-outside ml-6 space-y-2">{children}</ol>
            },
            li: ({ children }) => {
              return <li className="text-ink">{children}</li>
            },
          }}
        >
          {aboutContent}
        </ReactMarkdown>
      </div>
    </div>
  </div>
)

export default About
