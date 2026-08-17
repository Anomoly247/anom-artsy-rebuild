import { ArrowLeft, BookOpen, Download, Film, Heart, Palette, Play, Sparkles, Sprout, Star, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { LivingWorldWeb } from "@/components/LivingWorldWeb";

const palette = {
  base: "#050914",
  cyan: "#20cde2",
  magenta: "#e853dc",
  gold: "#d8ae55",
};

const archiveItems = {
  "moonberry-morning": {
    title: "Moonberry Morning",
    type: "Story archive",
    description: "A gentle morning walk through Moonberry Farm, where every berry glows with a new question.",
    icon: Sprout,
    accent: palette.magenta,
  },
  "pixel-and-dot": {
    title: "Pixel & Dot: The First Page",
    type: "Character tale",
    description: "The opening page of a cozy sibling story about wonder, protection, and finding the next bright idea together.",
    icon: Heart,
    accent: palette.cyan,
  },
  "moonberry-farm-trailer-reel": {
    title: "Moonberry Farm Trailer Reel",
    type: "Book trailer",
    description: "A cinematic preview of soft-lit paths, friendly residents, and storybook discoveries beyond the farm gate.",
    icon: Film,
    accent: palette.gold,
  },
  "cozy-corner-maker-kit": {
    title: "Cozy Corner Maker Kit",
    type: "Creative resource",
    description: "Gentle prompts for drawing, reading, and making a cozy creative corner of your own.",
    icon: Palette,
    accent: palette.magenta,
  },
  "the-lantern-gate": {
    title: "The Lantern Gate",
    type: "Moonberry tale",
    description: "A first step into Moonberry Farm, where the lanterns wake up and the path begins to glow.",
    icon: Star,
    accent: palette.gold,
  },
  "the-listening-pond": {
    title: "The Listening Pond",
    type: "Moonberry tale",
    description: "A quiet pond story about noticing small sounds, patient friends, and the questions that ripple outward.",
    icon: Sprout,
    accent: palette.cyan,
  },
  "the-story-tree": {
    title: "The Story Tree",
    type: "Moonberry tale",
    description: "An old tree keeps a shelf of unfinished tales and knows when a new voice is ready to add a page.",
    icon: BookOpen,
    accent: palette.magenta,
  },
  "the-moonberry-parade": {
    title: "The Moonberry Parade",
    type: "Featured tale",
    description: "A warm parade of lanterns, neighbors, and shared joy under the first bright moon of the season.",
    icon: Heart,
    accent: palette.gold,
  },
} as const;

type ArchiveSlug = keyof typeof archiveItems;

type DestinationShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent?: string;
};

function DestinationShell({ children, eyebrow, title, subtitle, accent = palette.cyan }: DestinationShellProps) {
  const [, navigate] = useLocation();

  return (
    <div className="ao-world-page min-h-screen text-white" style={{ backgroundColor: palette.base }}>
      <LivingWorldWeb variant="magenta" />
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-[#20cde2]/30 bg-[#050914]/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate("/anoms-corner")} className="gap-2 text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Anom&apos;s Corner
          </Button>
          <span className="hidden text-xs font-bold uppercase tracking-[0.3em] text-[#d8ae55] sm:inline">AO / Story Destination</span>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28 sm:pt-32">
        <section className="relative overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_15%_20%,rgba(0,240,255,0.14),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,47,208,0.14),transparent_34%),#0f111b] p-7 shadow-[0_0_28px_rgba(0,240,255,0.16)] sm:p-12" style={{ borderColor: `${accent}99` }}>
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border" style={{ borderColor: `${accent}30` }} />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full border border-[#20cde2]/20" />
          <div className="relative max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8ae55]">{eyebrow}</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl" style={{ color: accent }}>{title}</h1>
            <p className="mt-4 text-xl font-semibold text-[#e853dc] sm:text-2xl">{subtitle}</p>
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h2>
    </div>
  );
}

export function MoonberryFarm() {
  return (
    <DestinationShell eyebrow="World Destination / Cozy Planet" title="// MOONBERRY FARM //" subtitle="A Cozy Storytelling Zone." accent={palette.magenta}>
      <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">Moonberry Farm is the soft-lit kids planet inside Anom&apos;s Corner: a welcoming place where every path becomes a story, every resident has a little wisdom to share, and the night sky keeps room for one more question.</p>

      <div className="mt-10 space-y-10">
        <section className="rounded-2xl border border-[#20cde2]/50 bg-[#050914]/65 p-6 shadow-[0_0_24px_rgba(0,240,255,0.12)] sm:p-8">
          <SectionHeading eyebrow="01 / Soft-lit Trails" title="The paths remember every curious step." accent={palette.cyan} />
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-[#20405c] bg-[radial-gradient(circle_at_50%_0%,rgba(255,47,208,0.16),transparent_55%),#0d1b2b] p-6">
              <div className="flex items-center gap-3 text-[#d8ae55]"><Sprout className="h-6 w-6" aria-hidden="true" /><span className="text-xs font-bold uppercase tracking-[0.22em]">Narrative overview / trailhead</span></div>
              <p className="mt-5 text-base leading-8 text-slate-300">Start at the lantern gate and follow the moonberry trail past the listening pond, the old story tree, and the little hill where new tales are planted. The farm is designed for gentle discovery: read a page, notice a detail, then let the next scene find you.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Lantern Gate", slug: "the-lantern-gate" },
                { label: "Listening Pond", slug: "the-listening-pond" },
                { label: "Story Tree", slug: "the-story-tree" },
              ].map((trail, index) => (
                <Link key={trail.slug} href={`/archive/${trail.slug}`} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-4 transition-all hover:-translate-y-0.5 hover:border-[#20cde2]/70 hover:bg-[#20cde2]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]">
                  <span className="text-xs font-bold text-[#d8ae55]">0{index + 1}</span>
                  <p className="mt-2 font-bold text-[#20cde2]">{trail.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">A quiet place to pause and wonder.</p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e853dc]">Open story</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e853dc]/50 bg-[#050914]/65 p-6 shadow-[0_0_24px_rgba(255,47,208,0.12)] sm:p-8">
          <SectionHeading eyebrow="02 / Friendly Residents" title="Every neighbor carries a small light." accent={palette.magenta} />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Luma Lanternfox", role: "Trail Guide", text: "Keeps the farm paths warm after sundown and knows which story wants to be read next.", icon: Star },
              { name: "Mossbell", role: "Garden Keeper", text: "Grows moonberries in patient rows and listens closely to every new idea.", icon: Sprout },
              { name: "Pip & Pollen", role: "Page Turners", text: "A curious pair who collect favorite lines and leave them where friends can find them.", icon: Users },
            ].map((resident) => {
              const Icon = resident.icon;
              return (
                <article key={resident.name} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#050914] text-[#e853dc]"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                  <h3 className="mt-5 text-xl font-black text-[#20cde2]">{resident.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#d8ae55]">{resident.role}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{resident.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#d8ae55]/50 bg-[#d8ae55]/5 p-6 shadow-[0_0_24px_rgba(255,210,63,0.1)] sm:p-8">
          <SectionHeading eyebrow="03 / New Tales Ahead" title="Stories waiting at the edge of the map." accent={palette.gold} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "The Lantern Gate", slug: "the-lantern-gate" },
              { title: "The Listening Pond", slug: "the-listening-pond" },
              { title: "The Moonberry Parade", slug: "the-moonberry-parade" },
            ].map((story, index) => (
              <Link key={story.slug} href={`/archive/${story.slug}`} className="rounded-xl border border-[#20405c] bg-[#0d1b2b] p-5 transition-all hover:-translate-y-0.5 hover:border-[#e853dc]/70 hover:bg-[#e853dc]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e853dc]">Featured tale / 0{index + 1}</p>
                <h3 className="mt-3 text-lg font-black text-white">{story.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">A family-safe chapter about choosing kindness, noticing wonder, and making space at the table.</p>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#20cde2]">Read the tale</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DestinationShell>
  );
}

export function StoryArchiveIndex() {
  const [, navigate] = useLocation();
  return (
    <DestinationShell eyebrow="Archive Destination / Anom's Corner" title="// THE STORY SHELF //" subtitle="Every page opens a door." accent={palette.cyan}>
      <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">The family-safe archive is a quiet reading room for stories, book trailers, and creative resources. Choose a signal to enter its dedicated page.</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {Object.entries(archiveItems).map(([slug, entry]) => {
          const Icon = entry.icon;
          return (
            <button key={slug} type="button" onClick={() => navigate(`/archive/${slug}`)} className="flex items-center gap-3 rounded-xl border border-[#20405c] bg-[#050914]/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#e853dc]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ae55]">
              <Icon className="h-6 w-6" style={{ color: entry.accent }} aria-hidden="true" />
              <div><p className="font-bold text-[#20cde2]">{entry.title}</p><p className="text-xs uppercase tracking-[0.16em] text-slate-500">{entry.type}</p></div>
            </button>
          );
        })}
      </div>
    </DestinationShell>
  );
}

function ReadingColumn({ children, accent = palette.cyan }: { children: ReactNode; accent?: string }) {
  return <article className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#20405c] bg-[#050914]/80 px-6 py-8 shadow-[0_0_28px_rgba(0,240,255,0.1)] sm:px-12 sm:py-12" style={{ borderTopColor: `${accent}99` }}>{children}</article>;
}

function MediaPlaceholder({ title, label, accent, actionLabel }: { title: string; label: string; accent: string; actionLabel: string }) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border bg-[#0d1b2b]" style={{ borderColor: `${accent}88` }}>
      <div className="flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(0,240,255,0.14),transparent_30%),#050914]">
        <div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2" style={{ borderColor: accent, color: accent }}><Play className="ml-1 h-7 w-7" aria-hidden="true" /></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-[#d8ae55]">{label}</p></div>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold text-white">{title}</h3><p className="mt-1 text-xs text-slate-500">Trailer window / Moonberry Farm viewing room</p></div><Button variant="outline" className="border-[#20cde2]/70 bg-transparent text-[#20cde2] hover:bg-[#20cde2]/10 hover:text-[#20cde2]"><Play className="mr-2 h-4 w-4" aria-hidden="true" />{actionLabel}</Button></div>
    </div>
  );
}

export function StoryArchiveDetail() {
  const [, params] = useRoute("/archive/:slug");
  const slug = params?.slug as ArchiveSlug | undefined;
  const entry = slug ? archiveItems[slug] : undefined;
  const Icon = entry?.icon ?? BookOpen;

  if (!entry) {
    return <DestinationShell eyebrow="Archive Destination" title="// ARCHIVE SIGNAL //" subtitle="This page is still being written." accent={palette.gold}><p className="mt-6 text-base leading-7 text-slate-300">Return to Anom&apos;s Corner to choose another story destination.</p></DestinationShell>;
  }

  const activeSlug = slug as ArchiveSlug;
  const readingContent = {
    "moonberry-morning": (
      <>
        <h3 className="text-2xl font-black text-[#e853dc]">A question in the dew</h3>
        <p>Morning arrives softly at Moonberry Farm. Before the sun clears the hill, the lanterns blink awake and the berry fields begin to hum. Each moonberry holds a tiny reflection of the sky, as if the night left a little courage behind.</p>
        <p>At the first bend, a small question waits in the dew: <em>What will you notice today?</em> The answer is never the same twice. Sometimes it is a new friend. Sometimes it is a brave idea. Sometimes it is simply the warm feeling of walking beside someone you love.</p>
        <p>Luma Lanternfox leads the way without hurrying. She knows that a good morning is not measured by how far you travel, but by how closely you listen to the world around you.</p>
        <p>Follow the trail slowly. Moonberry Farm has never been in a hurry to tell its best stories, and there is always another bright detail waiting just beyond the next leaf.</p>
      </>
    ),
    "pixel-and-dot": (
      <>
        <h3 className="text-2xl font-black text-[#20cde2]">The first page</h3>
        <p>Pixel wore his light blue hoodie and checked the path ahead. The A on his chest caught the morning light, and his blue star shoes made him look ready for any small adventure.</p>
        <p>Dot tucked her fuzzy pink blanket close and looked for the first star. Her pink star shoes made two tiny marks in the soft ground, one beside Pixel&apos;s and one a little closer to the moonberry path.</p>
        <p>“We can go together,” Pixel said. Dot nodded. They followed the trail past the warm fence, past the listening pond, and toward the place where a story tree kept its pages open.</p>
        <p>That was the first page: not a grand beginning, but a promise between siblings that wonder is better when it is shared, and that protecting someone can mean making room for them to lead the way.</p>
      </>
    ),
    "moonberry-farm-trailer-reel": (
      <>
        <p>The farm gate glows. The lanterns rise. Somewhere beyond the story tree, a new adventure is waiting to be read.</p>
        <MediaPlaceholder title="Moonberry Farm Trailer Reel" label="Trailer media slot / 00:00" accent={entry.accent} actionLabel="Preview Reel" />
        <p>This viewing space is ready for the official trailer asset when it is connected to the archive. Until then, the frame holds the feeling of a cozy planet opening its doors.</p>
      </>
    ),
    "cozy-corner-maker-kit": (
      <>
        <p>Make a corner that feels like a safe harbor for ideas. Choose a soft color, draw a friendly resident, and write one sentence about a place where everyone is welcome.</p>
        <div className="my-8 rounded-xl border border-[#e853dc]/60 bg-[#e853dc]/5 p-5"><div className="flex items-center gap-3 text-[#e853dc]"><Palette className="h-6 w-6" aria-hidden="true" /><span className="font-bold">Creative Kit / Download Area</span></div><p className="mt-3 text-sm leading-6 text-slate-400">The printable maker kit gathers gentle prompts for drawing, reading, and making a cozy corner. Use the download area to keep the next creative invitation close at hand.</p><Button variant="outline" className="mt-5 border-[#e853dc]/70 bg-transparent text-[#e853dc] hover:bg-[#e853dc]/10 hover:text-[#e853dc]"><Download className="mr-2 h-4 w-4" aria-hidden="true" />Download Maker Kit</Button></div>
        <p>When your corner is ready, leave room for another page. The best creative spaces make sharing feel easy.</p>
      </>
    ),
    "the-lantern-gate": (
      <>
        <h3 className="text-2xl font-black text-[#d8ae55]">Where the path begins</h3>
        <p>The lanterns wake one by one at the edge of the farm, drawing a warm line through the blue morning mist. Their light is gentle enough for a shy traveler and bright enough for someone who has been waiting all day to feel brave.</p>
        <p>At the gate, a small copper bell makes one clear sound. Luma Lanternfox looks up from the path and smiles as if she has been expecting exactly this visitor.</p>
        <p>“The farm remembers every kind step,” she says. “You do not need to know the whole journey. You only need to choose the next light.”</p>
        <p>Step closer, listen for the first friendly hello, and let the story begin with the simple courage to enter.</p>
      </>
    ),
    "the-listening-pond": (
      <>
        <h3 className="text-2xl font-black text-[#20cde2]">What the water knows</h3>
        <p>The Listening Pond keeps the quiet sounds: a leaf touching water, a distant laugh, and the soft footsteps of a friend who knows how to wait. Its surface is never empty; it is simply paying attention.</p>
        <p>Mossbell brings a small cup of moonberry tea and sits beside the shore. Neither friend speaks at first. Together they hear a moth fold its wings, a pebble settle, and a new ripple travel from one side of the pond to the other.</p>
        <p>“The pond does not ask every sound to become a song,” Mossbell says. “Some sounds are here to help us notice that we are not alone.”</p>
        <p>Rest beside the shore and notice what arrives when nobody rushes the answer. Some stories begin as ripples before they become words.</p>
      </>
    ),
    "the-story-tree": (
      <>
        <h3 className="text-2xl font-black text-[#e853dc]">A page for every voice</h3>
        <p>The Story Tree holds unfinished pages in its branches. Each one is waiting for the right reader, the right question, or the right little spark of bravery. Its roots reach beneath the farm, carrying every kind sentence back into the soil.</p>
        <p>Pip and Pollen find a page with a blank middle. It begins with a traveler, a lantern, and a door that will not open until someone says something true.</p>
        <p>They invite the newest visitor to write the next line. The line is small, but it changes the whole page: <em>Everyone gets to come inside.</em></p>
        <p>Choose a branch, add one kind sentence, and leave the page ready for the next voice that finds it.</p>
      </>
    ),
    "the-moonberry-parade": (
      <>
        <h3 className="text-2xl font-black text-[#d8ae55]">Everyone carries a light</h3>
        <p>When the first bright moon rises, the residents of Moonberry Farm carry lanterns along the trail and make room for everyone in the parade. Some lanterns are tall, some are tiny, and one is shaped like a sleeping cat.</p>
        <p>There is music at the Story Tree, moonberries in every color, and a warm place at the center of the crowd. Luma guides the youngest walkers. Mossbell shares the first harvest. Pip and Pollen read the favorite lines collected from every path.</p>
        <p>Pixel and Dot arrive together, their star shoes flashing whenever they step over a root. Dot waves her blanket like a flag, and Pixel makes sure no one is left behind.</p>
        <p>The parade turns once around the farm before settling beneath the moon. At the center of it all is a promise: joy grows when it is shared.</p>
      </>
    ),
  } as Record<ArchiveSlug, ReactNode>;

  return (
    <DestinationShell eyebrow={`${entry.type} / Anom's Corner Archive`} title={`// ${entry.title.toUpperCase()} //`} subtitle="A story signal is active." accent={entry.accent}>
      <div className="mt-6 flex items-center gap-3 text-sm text-slate-400"><Icon className="h-5 w-5" style={{ color: entry.accent }} aria-hidden="true" />Family-safe archive / centered reading room</div>
      <ReadingColumn accent={entry.accent}>
        <div className="mb-8 border-b border-[#20405c] pb-6"><p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: entry.accent }}>{entry.type}</p><h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl">{entry.title}</h2><p className="mt-4 text-base leading-7 text-slate-400">{entry.description}</p></div>
        <div className="space-y-6 text-lg leading-9 text-slate-200">{readingContent[activeSlug]}</div>
        <div className="mt-10 flex items-center gap-3 border-t border-[#20405c] pt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#d8ae55]"><Sparkles className="h-4 w-4" aria-hidden="true" />End of chapter / return to the shelf for another story</div>
      </ReadingColumn>
    </DestinationShell>
  );
}
