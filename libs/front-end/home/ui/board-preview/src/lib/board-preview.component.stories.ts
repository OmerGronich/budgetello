import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BoardPreviewComponent } from './board-preview.component';
import { BoardPreviewModule } from './board-preview.module';

export default {
  title: 'Home/Board Preview',
  component: BoardPreviewComponent,
  decorators: [
    moduleMetadata({
      imports: [BoardPreviewModule],
    }),
  ],
} as Meta<BoardPreviewComponent>;

const Template: Story<BoardPreviewComponent> = (
  args: BoardPreviewComponent
) => ({
  props: args,
});

export const BoardPreview = Template.bind({});
BoardPreview.args = {
  boardTitle: 'Personal finances',
};
