import ProgramDonationForm from "../components/ProgramDonationForm"

export default function CreateProgramPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">
          Tambah Program Donasi
        </h1>
        <p>
          Silakan isi form di bawah ini untuk menambahkan program donasi baru
        </p>
      </div>
      <ProgramDonationForm type="create" />
    </section>
  )
}
