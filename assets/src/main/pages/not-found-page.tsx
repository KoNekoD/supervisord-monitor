import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className='flex justify-center'>
    <span className='flex gap-4'>
      <img src='/public/images/optimized/404.webp' alt='404 picture' />
      <div className='flex flex-col gap-4'>
        <span className={'text-3xl font-bold'}>Ошибка 404. Страница не найдена</span>
        <span className={'text-3xl font-extralight'}>А вот и нет тут ничего</span>
        <Link to={'/'} className='text-2xl font-extrabold underline'>
          На главную
        </Link>
      </div>
    </span>
  </div>
);
