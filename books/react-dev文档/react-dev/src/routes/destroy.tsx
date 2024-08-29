import { redirect } from 'react-router-dom';
import { deleteContact } from '../contacts';

async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect('/');
}

export { action };
