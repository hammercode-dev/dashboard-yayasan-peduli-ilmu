"use client"

import Link from "next/link"
import Image from "next/image"

import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { BankBadge } from "./BankBadge"
import { formatRupiah, formatDate } from "@/lib/format"
import { useGetDonationByIdQuery } from "../donation.api"
import { SkeletonDetail } from "../components/SkeletonDetail"

export default function DonationDetail({ id }: { id: string }) {
  const { data: detailDonation, isFetching: isLoadingDetailDonation } =
    useGetDonationByIdQuery(id ?? "")

  if (isLoadingDetailDonation) {
    return <SkeletonDetail />
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:mt-6">
      {/* Left Column - Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm ">
          <CardHeader>
            <CardTitle>Informasi Donatur</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Nama Donatur
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {detailDonation?.full_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  Nomor Telepon
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {detailDonation?.phone_number || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  E-mail
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {detailDonation?.email || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Donasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  Jumlah Donasi
                </p>
                <p className="text-2xl font-bold ">
                  {detailDonation?.amount != null ? formatRupiah(Number(detailDonation.amount)) : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Metode Pembayaran
                </p>

                <BankBadge channel={detailDonation?.payment_method || ""} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  Tanggal Donasi
                </p>
                <p className="text-gray-900">
                  {detailDonation?.donation_upload_at
                    ? formatDate(detailDonation.donation_upload_at)
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Program
                </p>

                {detailDonation?.program_donation ? (
                  <Link
                    href={`/dashboard/program/${detailDonation.program_donation.id}`}
                    className="inline-flex bg-muted text-sm rounded-full px-2.5 py-0.5 font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-muted"
                  >
                    {detailDonation.program_donation.title}
                  </Link>
                ) : (
                  "-"
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-2">Catatan</p>
              <p className="text-sm text-gray-900">
                {detailDonation?.description || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gambar Resi atau Bukti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              {detailDonation?.evidence_url ? (
                <div className="space-y-3">
                  <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={detailDonation?.evidence_url || ""}
                      alt="Donation Evidence"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Bukti Donasi
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Tidak ada bukti gambar
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aksi</CardTitle>
          </CardHeader>
          <CardContent className="gap-2 flex flex-col">
            <Link href={`/dashboard/donation/${id}/edit`}>
              <Button
                className="w-full hover:cursor-pointer"
                variant="outline"
                size="sm"
              >
                Ubah Data Donasi
              </Button>
            </Link>

            <Link
              href={`/dashboard/program/${detailDonation?.program_donation?.id}`}
            >
              <Button
                className="w-full hover:cursor-pointer"
                variant="outline"
                size="sm"
              >
                Lihat Detail Program
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
