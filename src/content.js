import { PaintBrush, MusicNotes, Books, Shapes, Stack, PianoKeys, PuzzlePiece, Cube, CirclesFour, Palette } from "@phosphor-icons/react";
export const WA = "https://wa.me/916009208311";
export const programs = [
  {
    slug: "arts-craft",
    title: "Arts & craft",
    icon: PaintBrush,
    color: "peach",
    intro: "Little hands. Limitless possibilities.",
    description:
      "Painting, drawing, collage and sculpture. A space to try, get wonderfully messy, and discover the joy of making something your own.",
    activities: [
      "Painting & drawing",
      "Clay & paper sculpture",
      "Collage & mixed media",
    ],
    note: "Explore materials, colors and ideas through hands-on creative sessions.",
  },
  {
    slug: "music",
    title: "Music",
    icon: MusicNotes,
    color: "butter",
    intro: "Find a rhythm of their own.",
    description:
      "Keyboard, rhythm and music for young learners. An invitation to listen, play and express themselves, one note at a time.",
    activities: ["Keyboard", "Rhythm & listening", "Music fundamentals"],
    note: "Discover music through practice, play and shared musical experiences.",
  },
  {
    slug: "school-visits",
    title: "School visits",
    icon: Books,
    color: "mint",
    intro: "Creativity, beyond our studio.",
    description:
      "Teaching support and school visits that bring arts and music into the classroom. Let’s make creative learning part of every school day.",
    activities: [
      "Teaching support",
      "Art & music activities",
      "School collaboration",
    ],
    note: "Contact the studio to discuss a session for your school.",
  },
  {
    slug: "educational-toys",
    title: "Learning through play",
    icon: Shapes,
    color: "blue",
    intro: "Small discoveries. Everyday wonder.",
    description:
      "Educational toys and wooden blocks that invite children to explore, build and imagine. Thoughtful tools for learning through play.",
    activities: ["Educational toys", "Wooden blocks", "Creative exploration"],
    note: "Ask the studio about the current selection and availability.",
  },
];
export const works = [
  {
    slug: "ideas-on-paper",
    title: "Ideas, on paper",
    category: "Art",
    image: "f848cc871214b0bb",
    caption:
      "Drawing, collage and a child’s own way of seeing the world. A glimpse of the ideas taking shape in Nascere’s arts and music class.",
    post: "Dcn7njICPWm",
  },
  {
    slug: "time-and-imagination",
    title: "Time & imagination",
    category: "Art",
    image: "888c4d0bb14d826e",
    caption:
      "A hand-drawn watch, and a conversation about children understanding time and place. Shared from the studio’s journal.",
    post: "Dcf6BOLiAL_",
  },
  {
    slug: "a-world-of-stories",
    title: "A world of stories",
    category: "Learning",
    image: "ad3ba2e3045dd411",
    caption:
      "Books, art and the everyday experiences that make room for learning. Thoughts from Nascere on a child’s early reading journey.",
    post: "DcyKL6eCP9e",
  },
];

// Nascere's selection changes regularly, so the catalogue deliberately avoids
// promising prices or stock. The studio confirms both in each WhatsApp enquiry.
export const toys = [
  {
    name: "Rainbow stacking blocks",
    category: "Build",
    age: "3+ years",
    icon: Stack,
    color: "pink",
    description: "Bright wooden forms to stack, sort and turn into anything a young builder can imagine.",
    develops: ["Balance & coordination", "Color recognition", "Open-ended play"],
  },
  {
    name: "Architect blocks",
    category: "Build",
    age: "4+ years",
    icon: Cube,
    color: "yellow",
    description: "A generous set of wooden pieces for towers, towns, bridges and wonderfully ambitious ideas.",
    develops: ["Spatial thinking", "Planning & patience", "Creative construction"],
  },
  {
    name: "Animal shape sorter",
    category: "Discover",
    age: "3+ years",
    icon: PuzzlePiece,
    color: "teal",
    description: "Friendly shapes and satisfying matches make early problem-solving feel like play.",
    develops: ["Shape recognition", "Fine motor skills", "Problem solving"],
  },
  {
    name: "Mini keyboard",
    category: "Music",
    age: "4+ years",
    icon: PianoKeys,
    color: "purple",
    description: "A child-friendly first keyboard for finding notes, making rhythms and playing little melodies.",
    develops: ["Listening", "Rhythm & memory", "Musical confidence"],
  },
  {
    name: "Nesting play set",
    category: "Discover",
    age: "3+ years",
    icon: CirclesFour,
    color: "pink",
    description: "Simple pieces that nest, order and rearrange for calm, repeatable discovery.",
    develops: ["Size comparison", "Hand-eye coordination", "Independent play"],
  },
  {
    name: "Creative clay set",
    category: "Create",
    age: "4+ years",
    icon: Palette,
    color: "yellow",
    description: "A hands-on invitation to roll, shape and tell stories with color and form.",
    develops: ["Sensory exploration", "Fine motor skills", "Imagination"],
  },
];
