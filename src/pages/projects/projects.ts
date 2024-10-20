export interface Project {
  name: string;
  demoLink: string;
  tags?: string[],
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: '[project name]',
    description: '[description]',
    demoLink: '[demo]',
    tags: ['tag']
  },
]
