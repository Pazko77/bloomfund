import logo from '/BloomfundNoText.svg';

function CagnottePageHero(){
    return <div className={"w-full h-175 bg-red-400 flex justify-center items-center bg-gradient-to-b from-green-600 from-50% to-white to-50%"}>
        <div className={"w-4/6 h-4/5 bg-white shadow-2xl rounded-2xl"}>
            <div className={"flex flex-col items-center justify-center w-full m-6 gap-3"}>
                <h1 className={"text-2xl font-bold "}>Titre</h1>
                <p>Petite description</p>
            </div>
            <div className={"flex flex-row px-6 gap-3"}>
                <img className={"w-[560px] h-[350px] rounded-2xl"} src={"https://static.wikia.nocookie.net/valorant/images/6/6c/Artwork_Valorant.jpg/revision/latest/scale-to-width-down/1000?cb=20240504212541&path-prefix=fr"}/>
                <div className={"flex flex-col w-full items-center justify-center gap-3"}>
                    <div className={"flex flex-row items-center gap-3"}>
                        <img className={"size-10"} src={`${logo}`}/><p className={"text-xl"}>1500 sur 4000 €</p>
                    </div>
                    {/* Progress bar*/}
                    <div className="w-full h-5 border-2 border-black rounded-2xl overflow-hidden bg-gray-100">
                        <div
                            className="h-full w-full bg-green-600 rounded-3xl origin-left transition-transform duration-1000 ease-out"
                            style={{transform: `scaleX(${10/100})`}}/>
                    </div>
                    <div className={"flex flex-row w-full justify-around"}>
                        <p className={""}>45 contributions</p>
                        <p className={""}>15 jours restants</p>
                    </div>
                    <div>
                        <button className={"w-full bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition-colors duration-300"}>
                            <p>
                                Contribuer
                            </p>
                            <p>A partir de 1€</p>
                        </button>
                    </div>
                    <p>Paiement sécurisé</p>
                </div>
            </div>
            <div className={"flex flex-row gap-3 p-6"}>
                <img className={"w-[48px] h-[48px] rounded-2xl hover:scale-75"}/>
                <div className={"flex flex-col"}>
                    <p>Nom d'utilisateur</p>
                    <div className={"flex flex-row gap-3"}>
                        <img className={"w-[15px] h-[15px]"}/><p>ville ou département</p>
                        <img className={"w-[15px] h-[15px]"}/><p>Catégorie</p>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

export default CagnottePageHero;
