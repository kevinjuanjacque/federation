import { Card } from "@tremor/react";
import History from "../components/home/history";
import Ingress from "../components/home/ingress";



export function Index() {


    return (
        <section className=" h-[80vh] flex flex-col justify-center items-center">
            <main className="flex max-w-screen-xl items-stretch gap-5 p-2 justify-center  max-h-[70%] flex-col md:flex-row">

                    <Card><History></History></Card>


                <Card><Ingress/></Card>


            </main>
        </section>
    )
}


export default Index;
