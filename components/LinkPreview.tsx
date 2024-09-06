import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import Link from "next/link";

type LinkPreview = {
    url: string;
    title: string;
    description: string;
    image: string | null;
};

type LinkPreviewProps = {
    preview: LinkPreview;
};

export default function LinkPreview({ preview }: LinkPreviewProps) {
    return (
        <Card className="mt-4">
            <Link href={preview.url} target="_blank">
                <CardHeader className="pt-4 px-4 pb-2">
                    <CardTitle className="text-sm line-clamp-2">{preview.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4 px-4">
                    {/* {preview.image && (
                    <Image src={preview.image} alt={preview.title} width={100} height={100} className="object-cover" />
                )} */}
                    <div>
                        <p className="text-sm text-gray-500 line-clamp-3">{preview.description}</p>
                        {/* <a href={preview.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {preview.url}
                        </a> */}
                    </div>
                </CardContent></Link>
        </Card>
    )
}