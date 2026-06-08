import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { marked } from "marked";

// JSON Collection: Team
const teamCollection = defineCollection({
  loader: file("./src/data/team.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return parsed.map((member: any, index: number) => ({
        id: member.handle ? member.handle.replace("@", "") : `member-${index}`,
        index,
        ...member,
        // Fallback or map relative assets path if folder exists
        image: member.image
          ? `../assets/images/team/${member.image}`
          : `../assets/images/team/placeholder.png`,
      }));
    },
  }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      index: z.number(),
      name: z.string(),
      handle: z.string().optional(),
      role: z.string(),
      image: image(), // Validates as local local asset object
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      mastodon: z.string().optional(),
    }),
});

// JSON Collection: Sponsors
const sponsorsCollection = defineCollection({
  loader: file("./src/data/sponsors.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return (parsed.events || []).map((event: any, index: number) => {
        // Rewrite nested sponsors logo array paths programmatically
        const updatedLevels = (event.levels || []).map((level: any) => ({
          ...level,
          sponsors: (level.sponsors || []).map((s: any) => ({
            ...s,
            logo: s.logo
              ? `../assets/images/sponsors/${s.logo}`
              : `../assets/images/overflow/placeholder.png`,
          })),
        }));

        return {
          id: event.name
            ? event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : `event-${index}`,
          index,
          ...event,
          image: event.image
            ? `../assets/images/events/${event.image}`
            : undefined,
          levels: updatedLevels,
        };
      });
    },
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      index: z.number(),
      image: image().optional(),
      dates: z.string(),
      location: z.string().optional(),
      description: z.string(),
      levels: z
        .array(
          z.object({
            name: z.string(),
            sponsors: z
              .array(
                z.object({
                  name: z.string(),
                  description: z.string(),
                  website: z.string(),
                  logo: image(), // Validated asset signature
                  socials: z
                    .array(z.object({ name: z.string(), url: z.string() }))
                    .optional(),
                }),
              )
              .optional(),
          }),
        )
        .optional(),
    }),
});

// JSON Collection: Cron Episodes
const rtvCronCollection = defineCollection({
  loader: file("./src/data/rtv-cron.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return (parsed || []).map((episode: any, index: number) => ({
        id: episode.title
          ? episode.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : `episode-${index}`,
        index,
        ...episode,
        html: marked.parse(episode.description),
        image: episode.image
          ? `../assets/images/episodes/${episode.image}`
          : `../assets/images/overflow/placeholder.png`,
      }));
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      index: z.number(),
      image: image(),
      presenter: z.string(),
      date: z.string(),
      description: z.string(),
      html: z.string(),
      tags: z.array(z.string()).default([]),
      sponsor: z.string().optional(),
      watchUrl: z.string(),
    }),
});

// JSON Collection: Events Schedule
const eventsScheduleCollection = defineCollection({
  loader: file("./src/data/schedule.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return (parsed || []).map((event: any, index: number) => ({
        id: event.title
          ? event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : `event-${index}`,
        index,
        ...event,
        image: event.image
          ? {
              ...event.image,
              src: `../assets/images/events/${event.image.src}`,
            }
          : undefined,
      }));
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      index: z.number(),
      dateRange: z.string(),
      tags: z.array(z.string()).default([]),
      times: z.string(),
      location: z.string(),
      description: z.string(),
      link: z
        .object({
          url: z.string(),
          text: z.string(),
          external: z.boolean().optional().default(false),
        })
        .optional(),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
    }),
});

// JSON Collection: Overflow Streaming Slots
const rtvOverflowCollection = defineCollection({
  loader: file("./src/data/rtv-overflow.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return (parsed || []).map((slot: any, index: number) => ({
        id: slot.title
          ? slot.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : `slot-${index}`,
        index,
        ...slot,
        image: slot.image
          ? `../assets/images/overflow/${slot.image}`
          : undefined,
        image2: slot.image2
          ? `../assets/images/overflow/${slot.image2}`
          : undefined,
      }));
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      index: z.number(),
      presenter: z.string(),
      datetime: z.string(),
      description: z.string(),
      image: image().optional(),
      image2: image().optional(),
    }),
});

// JSON Collection: Updates Feed
const updatesCollection = defineCollection({
  loader: file("./src/data/updates.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return (parsed || []).map((update: any, index: number) => ({
        id: update.title
          ? update.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : `update-${index}`,
        index,
        ...update,
        html: marked.parse(update.content || ""),
        image: update.image
          ? {
              ...update.image,
              src: `../assets/images/updates/${update.image.src}`,
            }
          : undefined,
      }));
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      index: z.number(),
      date: z.string(),
      tag: z
        .union([z.string(), z.array(z.string())])
        .transform((val) => (Array.isArray(val) ? val : [val]))
        .default([]),
      content: z.string(),
      html: z.string(),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      url: z
        .object({
          href: z.string(),
          text: z.string(),
          external: z.boolean().optional(),
          target: z.string().optional(),
        })
        .optional(),
    }),
});

// JSON Collection: Header
const headerCollection = defineCollection({
  loader: file("./src/data/header.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);
      return (parsed || []).map((element: any, index: number) => ({
        index,
        ...element,
      }));
    },
  }),
  schema: () =>
    z.object({
      id: z.string(),
      index: z.number(),
      name: z.string(),
      url: z.string(),
      target: z.string().optional(),
    }),
});

// JSON Collection: Footer
const footerCollection = defineCollection({
  loader: file("./src/data/footer.json", {
    parser: (text) => {
      const parsed = JSON.parse(text);

      return (parsed || []).map((element: any, index: number) => ({
        index,
        ...element,
        ariaLabel: `Visit RTV's ${element.id}`,
      }));
    },
  }),
  schema: () =>
    z.object({
      id: z.string(),
      index: z.number(),
      name: z.string(),
      url: z.string(),
      target: z.string().optional(),
      ariaLabel: z.string(),
    }),
});

export const collections = {
  team: teamCollection,
  sponsors: sponsorsCollection,
  "rtv-cron": rtvCronCollection,
  events: eventsScheduleCollection,
  "rtv-overflow": rtvOverflowCollection,
  updates: updatesCollection,
  header: headerCollection,
  footer: footerCollection,
};
