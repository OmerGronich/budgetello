import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddBoardFormComponent } from './add-board-form.component';
import { AddBoardFormModule } from './add-board-form.module';

export default {
  title: 'Home/Add Board Form',
  component: AddBoardFormComponent,
  decorators: [
    moduleMetadata({
      imports: [AddBoardFormModule],
    }),
  ],
} as Meta<AddBoardFormComponent>;

const Template: Story<AddBoardFormComponent> = (
  args: AddBoardFormComponent
) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
