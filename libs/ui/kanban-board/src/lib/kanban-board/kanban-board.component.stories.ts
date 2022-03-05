import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { KanbanBoardComponent } from './kanban-board.component';

export default {
  title: 'KanbanBoardComponent',
  component: KanbanBoardComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<KanbanBoardComponent>;

const Template: Story<KanbanBoardComponent> = (args: KanbanBoardComponent) => ({
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}