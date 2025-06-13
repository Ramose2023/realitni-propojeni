import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Realitní Propojení</h3>
            <p className="text-gray-300">
              Propojujeme prodávající nemovitostí s realitními makléři pro efektivní a transparentní spolupráci.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <p className="text-gray-300">Email: info@realitnipropojeni.cz</p>
            <p className="text-gray-300">Telefon: +420 123 456 789</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Odkazy</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  O nás
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Podmínky použití
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Ochrana osobních údajů
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Realitní Propojení. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
