import { personal } from '@content';
// import { PrivateField, personal } from '@content';
import { IdentificationIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';
import SectionHeading from 'src/components/section-heading/section-heading';

// interface ContactInformationProperties {
//   privateInformation?: PrivateField[];
// }

export default function ContactInformation({
  privateInformation,
}: any): ReactNode {
  return (
    <article className="space-y-4">
      <SectionHeading
        Icon={IdentificationIcon}
        level={3}
        text="联系信息"
        className="md:pl-48"
      />

      <ul className="md:pl-48">
        <li>
          <strong>地址:</strong> {personal.location}
        </li>
        <li>
          <strong>邮箱:</strong> {personal.email}
        </li>

        {/* private access required */}
        {/* {privateInformation?.map((privateField) => (
          <li className="mt-3" key={privateField.label}>
            <strong>{privateField.label}</strong>{' '}
            <div dangerouslySetInnerHTML={{ __html: privateField.body.html }} />
          </li>
        ))} */}
      </ul>
    </article>
  );
}
