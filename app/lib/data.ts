// import { sql } from '@vercel/postgres';
// import {
//   CustomerField,
//   CustomersTableType,
//   InvoiceForm,
//   InvoicesTable,
//   LatestInvoiceRaw,
//   User,
//   Revenue,
// } from './definitions';
// import { formatCurrency } from './utils';
// import { unstable_noStore as noStore } from 'next/cache';

// export async function fetchRevenue() {
//   // Add noStore() here prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).
//   noStore();

//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     // console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

// export async function fetchLatestInvoices() {
//   noStore();

//   try {
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }

// export async function fetchCardData() {
//   noStore();

//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
//     const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number,
// ) {
//   noStore();

//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<InvoicesTable>`
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   }
// }

// export async function fetchInvoicesPages(query: string) {
//   noStore();

//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchInvoiceById(id: string) {
//   noStore();

//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }

// export async function fetchCustomers() {
//   noStore();

//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   noStore();

//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }

// export async function getUser(email: string) {
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }

import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { users, customers, invoices, revenue } from './placeholder-data';

export async function fetchRevenue() {
  noStore();

  try {
    return revenue;
  } catch (error) {
    console.error('Failed to fetch revenue data:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    const latestInvoices = invoices.slice(0, 5).map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
      customer: customers.find((customer) => customer.id === invoice.customer_id),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Failed to fetch the latest invoices:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    const numberOfInvoices = invoices.length;
    const numberOfCustomers = customers.length;
    const totalPaidInvoices = invoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalPendingInvoices = invoices
      .filter((invoice) => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: formatCurrency(totalPaidInvoices),
      totalPendingInvoices: formatCurrency(totalPendingInvoices),
    };
  } catch (error) {
    console.error('Failed to fetch card data:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string, currentPage: number) {
  noStore();

  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const filteredInvoices = invoices
      .filter((invoice) => {
        const customer = customers.find((c) => c.id === invoice.customer_id);
        return (
          customer?.name.toLowerCase().includes(query.toLowerCase()) ||
          customer?.email.toLowerCase().includes(query.toLowerCase()) ||
          invoice.amount.toString().includes(query) ||
          invoice.date.includes(query) ||
          invoice.status.toLowerCase().includes(query.toLowerCase())
        );
      })
      .slice(offset, offset + ITEMS_PER_PAGE)
      .map((invoice) => ({
        ...invoice,
        customer: customers.find((customer) => customer.id === invoice.customer_id),
      }));

    return filteredInvoices;
  } catch (error) {
    console.error('Failed to fetch filtered invoices:', error);
    throw new Error('Failed to fetch filtered invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    const filteredCount = invoices.filter((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id);
      return (
        customer?.name.toLowerCase().includes(query.toLowerCase()) ||
        customer?.email.toLowerCase().includes(query.toLowerCase()) ||
        invoice.amount.toString().includes(query) ||
        invoice.date.includes(query) ||
        invoice.status.toLowerCase().includes(query.toLowerCase())
      );
    }).length;

    return Math.ceil(filteredCount / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Failed to fetch invoice pages:', error);
    throw new Error('Failed to fetch invoice pages.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  
  try {
    const invoice = invoices[0];

    if (!invoice) {
      throw new Error('Invoice not found.');
    }

    return {
      ...invoice,
      amount: invoice.amount / 100,
    };
  } catch (error) {
    console.error('Failed to fetch invoice by ID:', error);
    throw new Error('Failed to fetch invoice by ID.');
  }
}

export async function fetchCustomers() {
  noStore();

  try {
    return customers;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();

  try {
    const filteredCustomers = customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.email.toLowerCase().includes(query.toLowerCase())
      )
      .map((customer) => {
        const customerInvoices = invoices.filter((invoice) => invoice.customer_id === customer.id);
        const totalPending = customerInvoices
          .filter((invoice) => invoice.status === 'pending')
          .reduce((sum, invoice) => sum + invoice.amount, 0);
        const totalPaid = customerInvoices
          .filter((invoice) => invoice.status === 'paid')
          .reduce((sum, invoice) => sum + invoice.amount, 0);

        return {
          ...customer,
          total_invoices: customerInvoices.length,
          total_pending: formatCurrency(totalPending),
          total_paid: formatCurrency(totalPaid),
        };
      });

    return filteredCustomers;
  } catch (error) {
    console.error('Failed to fetch filtered customers:', error);
    throw new Error('Failed to fetch filtered customers.');
  }
}

export async function getUser(email: string) {
  try {
    const user = users.find((user) => user.email === email);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}