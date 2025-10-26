import { Dialog, DialogContent } from '@/components/ui/Dialog';
import CreateApp from '@/app/dashboard/apps/new/page';
import { DialogTitle } from '@radix-ui/react-dialog';
import BackableDialog from './backable-dialog';

export default function InterceptingCreateApp() {
  return (
    <BackableDialog>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <CreateApp></CreateApp>
      </DialogContent>
    </BackableDialog>
  );
}
