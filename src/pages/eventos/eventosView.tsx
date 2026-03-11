const EventosView: React.FC = () => {

  return (
    <main className="p-4 w-full h-auto">
      <section className="grid grid-cols-12 gap-8 w-full h-auto">
        <div className="col-span-8 w-full h-full">
          <img src="/img/image.png" alt="Marcus chen" className="rounded-xl shadow-lg object-cover w-full h-3/4" />
        </div>

        <div className="col-span-4 p-6 border-t-4 border-t-primary rounded-xl shadow-lg w-full h-auto">
          <div className="flex justify-between items-center w-full h-auto">
            <p className="text-zinc-400 text-xs">
              L U G A R E S {" "} D I S P O N I B L E S
            </p>
            <p>
              <span className="text-primary font-semibold">158</span> / 200
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default EventosView;