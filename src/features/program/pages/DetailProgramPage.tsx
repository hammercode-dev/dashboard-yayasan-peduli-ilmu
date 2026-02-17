import ProgramDonationForm from "../components/ProgramDonationForm"

export default function DetailProgramPage({ id }: { id: string }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">
          Detail Program Donasi
        </h1>
        <p>Berikut adalah detail program donasi yang telah dibuat</p>
      </div>
      <ProgramDonationForm id={id} type="edit" />
    </section>
  )
}
