function CagnottePageHero() {
  return (
    <div
      className={
        "w-full h-175 bg-red-400 flex justify-center items-center bg-gradient-to-b from-green-600 from-50% to-white to-50%"
      }
    >
      <div className={"w-4/6 h-4/5 bg-white shadow-2xl rounded-2xl"}>
        <div
          className={
            "flex flex-col items-center justify-center w-full m-6 gap-3"
          }
        >
          <h1 className={"text-2xl font-bold "}>Titre</h1>
          <p>Petite description</p>
        </div>
        <div className={"flex flex-row px-6 gap-3"}>
          <img
            className={"w-[560px] h-[350px] rounded-2xl"}
            src={
              "https://static.wikia.nocookie.net/valorant/images/6/6c/Artwork_Valorant.jpg/revision/latest/scale-to-width-down/1000?cb=20240504212541&path-prefix=fr"
            }
          />
          <div>
            <p>Objectif : 1000€</p>
            <p>Montant récolté : 500€</p>
            <p>Nombre de donateurs : 25</p>
          </div>
        </div>
        <div className={"flex flex-row gap-3 p-6"}>
          <img className={"w-[48px] h-[48px] rounded-2xl hover:scale-75"} />
          <div className={"flex flex-col"}>
            <p>Nom d'utilisateur</p>
            <div className={"flex flex-row gap-3"}>
              <img className={"w-[15px] h-[15px]"} />
              <p>ville ou département</p>
              <img className={"w-[15px] h-[15px]"} />
              <p>Catégorie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CagnottePageHero;
