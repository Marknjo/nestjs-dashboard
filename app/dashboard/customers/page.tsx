import {
  ITEMS_PER_PAGE,
  fetchCustomers,
  fetchFilteredCustomers,
} from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';
import Pagination from '@/app/ui/invoices/pagination';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const [customers, allCustomers] = await Promise.all([
    fetchFilteredCustomers(query, currentPage),
    fetchCustomers(),
  ]);

  const totalPages = Math.ceil(
    Number(query !== '' ? customers.length : allCustomers.length) /
      ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full">
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <CustomersTable customers={customers} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
