import Image from "next/image";
export default function Home() {
  const Card = ({ title, link, description }) => {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-lg shadow-md p-4 mb-4 block basis-0 grow hover:shadow-lg hover:translate-y-0.5 transition-transform"
      >
        <h2 className="text-xl mb-2 font-medium tracking-tighter">{title}</h2>
        <p>{description}</p>
      </a>
    );
  };

  return (
    <main className="bg-gradient-to-b from-blue-500 to-blue-900 dark:from-gray-800 dark:to-gray-900 min-h-screen flex items-center justify-center flex-col font-sans">
    <div className="max-w-2xl mx-auto p-4">

      <h1 className="text-white mb-2 font-thin text-6xl font-header tracking-tighter">Ishgardian Tools</h1>

      {/* https://www.reddit.com/r/typography/comments/rzn13q/comment/hrwkg46/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button */}
      {/* https://x.com/Omocheck/status/1534747051103121408 */}
      {/* https://github.com/thewakingsands/ffxiv-axis-font-icons/blob/master/README_en.md */}

      <p className="text-2xl font-light text-white mb-8">Coming soon...</p>
      <p className="font-light text-white mb-8">If you stumble upon this page, it means that the website is still in development. Feel free to answer our <a href="https://forms.gle/gLztQmJ3uw1xdL5XA" className="underline" target="_blank">survey</a> to help us improve the website. 🙏</p>


      <h2 className="text-4xl font-light text-white mb-4 font-header tracking-tighter">Other tools, in the meantime...</h2>
      <div className="flex flex-col md:flex-row justify-center flex-wrap gap-4">
        <Card
          title="Moogle Search"
          link="https://moogle-search.vercel.app/"
          description="Check out a FFXIV multilingual search engine."
          />

        <Card
          title="Garland Tools"
          link="https://garlandtools.org/"
          description="The original FFXIV database website."
          />

        <Card
          title="Source code"
          link="https://github.com/maxencelav/ishgardian-tools"
          description="Go behind the scenes and see the source code."
          />
        </div>
      </div>
    </main>
  );
}
