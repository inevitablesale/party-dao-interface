
export interface Section {
  id: string;
  title: string;
  subsections?: Subsection[];
}

export interface Subsection {
  id: string;
  title: string;
}

export interface SectionContentProps {
  sectionId: string;
}
