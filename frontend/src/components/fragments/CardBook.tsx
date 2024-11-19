import Image from "next/image";
import Link from "next/link";

export default function CardBook({
  title,
  image,
  href,
  authorName,
  publisherName,
  quantity,
}: {
  title: string;
  image: string;
  href: string;
  authorName: string;
  publisherName: string;
  quantity: number;
}) {
  return (
    <div className="dark:bg-dark2 dark:border-dark1 max-w-sm rounded-md border-2 border-cloud p-3">
      <Link href={href}>
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="mb-6 h-[250px] w-[390px] rounded-md object-cover object-center"
        />
      </Link>
      <h1 className="dark:text-light mb-6 mt-4 h-24 text-2xl font-semibold">
        {title}
      </h1>

      <div className="flex flex-row justify-between items-center gap-3 text-gray-600">
        <div className="space-x-3">
          <span className="font-mediumtext-gray300 text-base">
            {authorName}
          </span>
          <span className="text-basetext-gray300">{publisherName}</span>
        </div>
        <span>qty : {quantity}</span>
      </div>
    </div>
  );
}
