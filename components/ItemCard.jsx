import Image from "next/image";
import { useState, useEffect } from "react";
// import { toast } from 'react-hot-toast';

export function ItemCard({ id, item, currentLanguage, languageList }) {
  /* Gather info based on the item ID using https://xivapi.com/item/id */
  // https://beta.xivapi.com/api/1/search?sheets=Item&query=%2BLevelItem%3E710%20%2BClassJobCategory.PCT=true

  currentLanguage = currentLanguage || "en";
  languageList = languageList || ["en", "de", "fr", "ja"];

  const [additionalInfo, setadditionalInfo] = useState();

  useEffect(() => {
    // declare the data fetching function
    const getInfo = async () => {
      const response = await fetch(
        "https://beta.xivapi.com/api/1/sheet/Item/" + id,
        {
          headers: {
            "User-Agent": "IshgardianTools"
          }
        }
      );
      const data = await response.json();
      setadditionalInfo(data);
    };

    // call the function
    getInfo().catch((err) => {
      console.error(err);
    });
  }, [id]);

  function ClickToCopy({ className, text }) {
    return (
      <span
        className={className}
        onClick={() => {
          navigator.clipboard.writeText(text);
          // toast
          // toast.success(`Copied ${text} to your clipboard.`, {
          //   position: "bottom-left",
          //   autoClose: 2000,
          //   hideProgressBar: true,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          // });
        }}
      >
        {text}
      </span>
    );
  }

  function languageListing(language) {
    return (
      <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-1 select-none">
        <span className="bg-zinc-100 text-zinc-800 text-xs font-medium inline-block text-center w-5 mr-2 py-0.5 rounded dark:bg-zinc-700 dark:text-zinc-300 select-none">
          {language.toUpperCase().charAt(0)}
        </span>
        <ClickToCopy
          className="hover:underline cursor-pointer"
          text={item[language]}
        />
      </p>
    );
  }

  function footerButton(url, text) {
    return (
      <a
        href={url}
        className="grow text-center text-zinc-700 dark:text-zinc-400 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 px-2 py-1"
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </a>
    );
  }

  if (!id || !item ) {
    return (
      <div className="w-full rounded overflow-hidden h-60 animate-pulse bg-orange-100 dark:bg-zinc-800 dark:text-zinc-200 flex flex-col justify-between border border-stone-500/30 z-20">
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded overflow-hidden drop-shadow-md bg-orange-100 dark:bg-zinc-800 dark:text-zinc-200 flex flex-col justify-between border border-stone-500/30 z-20 ${additionalInfo ? "" : "animate-pulse"}`}
      key={id}
    >
      <div className="flex mx-4 mt-4 mb-2 grow">
        {additionalInfo ? (
          <Image
            src={`https://beta.xivapi.com/api/1/asset/${additionalInfo["fields"]["Icon"]["path"]}?format=png`}
            alt={item[currentLanguage]}
            width={50}
            height={50}
            className="rounded w-10 h-10 bg-zinc-600 flex-shrink-0"
          />
        ) : (
          <div className="rounded w-10 h-10 bg-zinc-600 animate-pulse flex-shrink-0"></div>
        )}
        <div className="font-bold text-xl ml-2 mb-2 leading-none">
          {item[currentLanguage]}
        </div>
      </div>
      <span className="bg-stone-700 text-stone-300 dark:bg-zinc-950/50 dark:text-zinc-300 w-full text-xs font-semibold uppercase tabular-nums inline-block mb-2 px-2 pb-1 pt-0.5 font-wide min-h-6">
        {additionalInfo ? `ITEM LEVEL ${additionalInfo["fields"]["LevelItem"].value}` : ""}
      </span>
      <div className="px-4 grow ">
        {languageList.map((language) => {
          if (item[language]) {
            return languageListing(language);
          }
        })}
      </div>
      {/* footer with two small buttons */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 flex justify-items-stretch mt-2 flex-none">
        {footerButton(
          "https://garlandtools.org/db/#item/" + id,
          "Garland Tools"
        )}
        {footerButton(
          "https://ffxiv.consolegameswiki.com/wiki/" + item["en"],
          "CGWiki"
        )}
        {footerButton(
          "https://ffxivteamcraft.com/db/" + currentLanguage + "/item/" + id,
          "Teamcraft"
        )}
      </div>
    </div>
  );
}
