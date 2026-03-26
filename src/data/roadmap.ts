export type RoadmapItem = {
  label: string
  done: boolean
}

export const roadmapDeadline = '2026-04-30'

export const roadmapItems: RoadmapItem[] = [
  { label: "Implement Photos page",                         done: true  },
  { label: "Implement Geoguessr stats page",                done: false },
  { label: "Implement Bike dashboard (Strava API)",         done: false },
  { label: "Build irrigation management system (LoRa32)",   done: false },
  { label: "Build HabitSignal (productivity logger)",       done: false },
]
