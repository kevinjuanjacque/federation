import { Card } from '@tremor/react';
import History from '../components/home/history';
import Ingress from '../components/home/ingress';

export function Index() {
  return (
    <section className=" h-full md:h-[80vh] flex flex-col justify-center items-center">
      <main className="flex md:max-w-screen-xl md:items-stretch gap-5 p-2 justify-center  md:max-h-[70%] flex-col md:flex-row">
        <Card>
          <History></History>
        </Card>

        <Card>
          <Ingress />
        </Card>
      </main>
    </section>
  );
}

export default Index;
