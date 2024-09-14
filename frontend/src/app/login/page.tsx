'use client'

import { Suspense } from 'react';

import LoginForm from './form';

import Loading from '@/components/loading/loading';

export default function Login() {

  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
